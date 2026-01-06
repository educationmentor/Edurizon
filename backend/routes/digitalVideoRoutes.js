const express = require('express');
const mongoose = require('mongoose');
const { AdminUser } = require('../models/AdminUser');

const router = express.Router();

// Use existing admin auth middlewares to protect these routes
const { protectAdminRoute, isSuperAdmin } = require('../middleware/adminAuth');

// Create a new video and assign it to a digital admin
router.post(
  '/assign',
  protectAdminRoute,
  isSuperAdmin,
  async (req, res) => {
    try {
      const {
        assignedToId,
        videoName,
        dateOfShoot,
        platform,
        description,
        deadline,
        message,
      } = req.body;

      if (!assignedToId || !mongoose.Types.ObjectId.isValid(assignedToId)) {
        return res.status(400).json({ message: 'Valid assignedToId is required' });
      }

      if (!videoName || typeof videoName !== 'string') {
        return res.status(400).json({ message: 'videoName is required' });
      }

      const targetAdmin = await AdminUser.findById(assignedToId);
      if (!targetAdmin) {
        return res.status(404).json({ message: 'Target digital admin not found' });
      }

      const newVideo = {
        videoName: videoName.trim(),
        dateOfShoot: dateOfShoot ? new Date(dateOfShoot) : undefined,
        videoEdited: false,
        thumbnailUploaded: false,
        captionAdded: false,
        videoUploaded: false,
        uploadDate: null,
        platform: Array.isArray(platform)
          ? platform
          : platform
          ? [platform]
          : [],
        description: description || '',
        assignedTo: assignedToId,
        assignedBy: req.adminUser ? req.adminUser._id : null,
        assignmentDeadline: deadline ? new Date(deadline) : null,
        assignmentMessage: message || null,
      };

      const updatedAdmin = await AdminUser.findByIdAndUpdate(
        assignedToId,
        { $push: { digitalMarketingVideos: newVideo } },
        { new: true }
      );

      if (!updatedAdmin) {
        return res.status(500).json({ message: 'Failed to create and assign video' });
      }

      const createdVideo =
        updatedAdmin.digitalMarketingVideos[updatedAdmin.digitalMarketingVideos.length - 1];

      return res.status(201).json({
        message: 'Video created and assigned successfully',
        video: createdVideo,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Unable to create and assign task',
        error: error.message,
      });
    }
  }
);

router.patch(
  '/assign/:videoId',
  protectAdminRoute,
  isSuperAdmin,
  async (req, res) => {
    try {
      const { videoId } = req.params;
      const { assignedToId, deadline, message } = req.body;

      if (!videoId) {
        return res.status(400).json({ message: 'Video ID is required' });
      }

      if (!assignedToId && !deadline && !message) {
        return res.status(400).json({ message: 'No assignment fields provided' });
      }

      const updatePayload = {};

      if (assignedToId) {
        updatePayload['digitalMarketingVideos.$.assignedTo'] = new mongoose.Types.ObjectId(
          assignedToId
        );
      } else {
        updatePayload['digitalMarketingVideos.$.assignedTo'] = null;
      }

      if (deadline) {
        updatePayload['digitalMarketingVideos.$.assignmentDeadline'] = new Date(deadline);
      } else {
        updatePayload['digitalMarketingVideos.$.assignmentDeadline'] = null;
      }

      if (message !== undefined) {
        updatePayload['digitalMarketingVideos.$.assignmentMessage'] = message || null;
      }

      const result = await AdminUser.updateOne(
        { 'digitalMarketingVideos._id': videoId },
        { $set: updatePayload }
      );

      if (!result.matchedCount) {
        return res.status(404).json({ message: 'Video not found' });
      }

      return res.json({ message: 'Video assignment updated' });
    } catch (error) {
      return res.status(500).json({ message: 'Unable to assign task', error: error.message });
    }
  }
);

router.patch(
  '/deadline/:videoId',
  protectAdminRoute,
  isSuperAdmin,
  async (req, res) => {
    try {
      const { videoId } = req.params;
      const { newDeadline } = req.body;

      if (!videoId) {
        return res.status(400).json({ message: 'Video ID is required' });
      }

      if (!newDeadline) {
        return res.status(400).json({ message: 'New deadline is required' });
      }

      const result = await AdminUser.updateOne(
        { 'digitalMarketingVideos._id': videoId },
        { $set: { 'digitalMarketingVideos.$.assignmentDeadline': new Date(newDeadline) } }
      );

      if (!result.matchedCount) {
        return res.status(404).json({ message: 'Video not found' });
      }

      return res.json({ message: 'Video deadline updated' });
    } catch (error) {
      return res.status(500).json({ message: 'Unable to update deadline', error: error.message });
    }
  }
);

module.exports = router;

