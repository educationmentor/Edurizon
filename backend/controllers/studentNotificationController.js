const mongoose = require('mongoose');
const { RegisteredStudent } = require('../models/registeredUserModel');

const getStudentNotifications = async (req, res) => {
  try {
    const student = await RegisteredStudent.findById(req.user._id).select('notifications');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    let requiresSave = false;
    student.notifications = student.notifications.map((notification) => {
      if (!notification._id) {
        notification._id = new mongoose.Types.ObjectId();
        requiresSave = true;
      }
      return notification;
    });

    if (requiresSave) {
      student.markModified('notifications');
      await student.save();
    }

    // Filter out read notifications - only return unread ones
    const unreadNotifications = student.notifications
      .filter(notification => !notification.isRead)
      .sort(
        (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      );

    return res.status(200).json({
      success: true,
      notifications: unreadNotifications
    });
  } catch (error) {
    console.error('Error fetching student notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const student = await RegisteredStudent.findOneAndUpdate(
      { _id: req.user._id, 'notifications._id': notificationId },
      { $set: { 'notifications.$.isRead': true } },
      { new: true, projection: { notifications: 1 } }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    const updatedNotification = student.notifications.find(
      (notification) => notification._id.toString() === notificationId
    );

    return res.status(200).json({
      success: true,
      notification: updatedNotification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update notification'
    });
  }
};

module.exports = {
  getStudentNotifications,
  markNotificationAsRead
};

