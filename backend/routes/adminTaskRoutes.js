const express = require('express');
const AdminTask = require('../model/AdminTask');
const { protectAdminRoute, restrictTo } = require('../middleware/adminAuth');

const router = express.Router();

// Create new task/update (super admin only)
router.post(
  '/tasks',
  protectAdminRoute,
  restrictTo('super-admin'),
  async (req, res) => {
    try {
      const { messageDetail, deadline, recipientAdminIds, taskType } = req.body || {};

      const normalizedTaskType = taskType === 'Update' ? 'Update' : 'Task';

      if (!messageDetail || !Array.isArray(recipientAdminIds) || !recipientAdminIds.length) {
        return res
          .status(400)
          .json({ message: 'messageDetail and recipientAdminIds are required.' });
      }

      // For "Task" type, deadline is required; for "Update" it is optional
      if (normalizedTaskType === 'Task' && !deadline) {
        return res
          .status(400)
          .json({ message: 'deadline is required for Task type.' });
      }

      const assignedTo = recipientAdminIds.map((adminId) => ({
        adminId,
        isRead: false,
        isDeleted: false,
      }));

      const task = await AdminTask.create({
        messageDetail,
        taskType: normalizedTaskType,
        // Only set deadline if provided (avoids storing undefined for Updates)
        ...(deadline ? { deadline } : {}),
        assignedBy: req.adminUser._id,
        assignedTo,
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Failed to create admin task:', error);
      res.status(500).json({ message: 'Failed to create task.' });
    }
  }
);

// Get tasks for current admin
router.get('/tasks/me', protectAdminRoute, async (req, res) => {
  try {
    const tasks = await AdminTask.find({
      assignedTo: {
        $elemMatch: {
          adminId: req.adminUser._id,
          isDeleted: false,
        },
      },
    })
      .populate('assignedBy', 'name email firstName lastName')
      .populate('replies.senderId', 'name email firstName lastName role');

    res.json(tasks);
  } catch (error) {
    console.error('Failed to fetch admin tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
});

// Get tasks sent by current admin (typically super admin)
router.get(
  '/tasks/sent',
  protectAdminRoute,
  restrictTo('super-admin'),
  async (req, res) => {
    try {
      const tasks = await AdminTask.find({
        assignedBy: req.adminUser._id,
      })
        .populate('assignedBy', 'name email')
        .populate('assignedTo.adminId', 'firstName lastName email role')
        .populate('replies.senderId', 'firstName lastName email role');

      res.json(tasks);
    } catch (error) {
      console.error('Failed to fetch sent admin tasks:', error);
      res.status(500).json({ message: 'Failed to fetch sent tasks.' });
    }
  }
);

// Mark task as read for current admin
router.patch('/tasks/read/:taskId', protectAdminRoute, async (req, res) => {
  try {
    const { taskId } = req.params;

    const result = await AdminTask.updateOne(
      { _id: taskId, 'assignedTo.adminId': req.adminUser._id },
      { $set: { 'assignedTo.$.isRead': true } }
    );

    if (!result.matchedCount) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task marked as read.' });
  } catch (error) {
    console.error('Failed to mark task as read:', error);
    res.status(500).json({ message: 'Failed to update task.' });
  }
});

// Soft delete task for current admin / hard delete for super admin owner
router.patch('/tasks/delete/:taskId', protectAdminRoute, async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await AdminTask.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Super admin deleting their own task removes it entirely
    if (
      req.adminUser.role === 'super-admin' &&
      task.assignedBy.toString() === req.adminUser._id.toString()
    ) {
      await AdminTask.deleteOne({ _id: taskId });
      return res.json({ message: 'Task deleted for all recipients.' });
    }

    const result = await AdminTask.updateOne(
      { _id: taskId, 'assignedTo.adminId': req.adminUser._id },
      { $set: { 'assignedTo.$.isDeleted': true } }
    );

    if (!result.matchedCount) {
      return res.status(404).json({ message: 'Task not assigned to this admin.' });
    }

    res.json({ message: 'Task deleted for current admin.' });
  } catch (error) {
    console.error('Failed to delete task:', error);
    res.status(500).json({ message: 'Failed to update task.' });
  }
});

// Add reply to task thread
router.post('/tasks/reply/:taskId', protectAdminRoute, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { replyMessage } = req.body || {};

    if (!replyMessage) {
      return res.status(400).json({ message: 'replyMessage is required.' });
    }

    const updatedTask = await AdminTask.findByIdAndUpdate(
      taskId,
      {
        $push: {
          replies: {
            senderId: req.adminUser._id,
            replyMessage,
          },
        },
        $set: {
          senderHasNewReply: true,
        },
      },
      { new: true }
    )
      .populate('assignedBy', 'name email')
      .populate('replies.senderId', 'name email');

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Failed to add reply:', error);
    res.status(500).json({ message: 'Failed to add reply.' });
  }
});

// Clear reply notification for super admin
router.patch(
  '/tasks/:taskId/clear-reply-notification',
  protectAdminRoute,
  restrictTo('super-admin'),
  async (req, res) => {
    try {
      const { taskId } = req.params;

      const task = await AdminTask.findOneAndUpdate(
        { _id: taskId, assignedBy: req.adminUser._id },
        { $set: { senderHasNewReply: false } },
        { new: true }
      );

      if (!task) {
        return res.status(404).json({ message: 'Task not found or not authorized.' });
      }

      res.json({ message: 'Reply notification cleared.', task });
    } catch (error) {
      console.error('Failed to clear reply notification:', error);
      res.status(500).json({ message: 'Failed to clear reply notification.' });
    }
  }
);

module.exports = router;

