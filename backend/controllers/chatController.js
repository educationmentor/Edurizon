const asyncHandler = require('express-async-handler');
const ChatMessage = require('../models/chatMessageModel');
const mongoose = require('mongoose');

// @desc    Get chat history for a consultation request
// @route   GET /api/chat/:requestId
// @access  Private
const getChatHistory = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  
  try {
    // Validate requestId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }

    // Get messages with proper sorting by timestamp
    const messages = await ChatMessage.find({ 
      consultationRequest: requestId 
    }).sort({ createdAt: 1 });
    
    // Mark messages as read if they were sent to this user
    // Check if this is admin authentication or regular user authentication
    let userType;
    if (req.adminUser) {
      // Admin users (counsellor, super-admin, etc.) are treated as counselors
      userType = 'counselor';
    } else if (req.user?.role === 'counselor') {
      userType = 'counselor';
    } else {
      userType = 'registered-student';
    }
    const oppositeType = userType === 'counselor' ? 'registered-student' : 'counselor';
    
    // Update read status for messages sent by the other party
    await ChatMessage.updateMany(
      { 
        consultationRequest: requestId,
        senderType: oppositeType,
        read: false
      },
      { read: true }
    );
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat history'
    });
  }
});

// @desc    Mark messages as read
// @route   PUT /api/chat/:requestId/read
// @access  Private
const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  
  try {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format'
      });
    }

    // Check if this is admin authentication or regular user authentication
    let userType;
    if (req.adminUser) {
      // Admin users (counsellor, super-admin, etc.) are treated as counselors
      userType = 'counselor';
    } else if (req.user?.role === 'counselor') {
      userType = 'counselor';
    } else {
      userType = 'registered-student';
    }
    const oppositeType = userType === 'counselor' ? 'registered-student' : 'counselor';
    
    // Mark messages from the other user as read
    const result = await ChatMessage.updateMany(
      { 
        consultationRequest: requestId,
        senderType: oppositeType,
        read: false
      },
      { read: true }
    );
    
    res.json({
      success: true,
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
});

// @desc    Get chat history for a user (student)
// @route   GET /api/chat/user/:userId
// @access  Private
const getUserChatHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Get messages where the user is either sender or receiver, or where consultationRequest matches userId
    const messages = await ChatMessage.find({ 
      $or: [
        { senderId: userId },
        { receiverId: userId },
        { consultationRequest: userId }
      ]
    }).sort({ createdAt: 1 });
    
    // Mark messages as read if they were sent to this user
    let userType;
    if (req.adminUser) {
      userType = 'counselor';
    } else if (req.user?.role === 'counselor') {
      userType = 'counselor';
    } else {
      userType = 'registered-student';
    }
    const oppositeType = userType === 'counselor' ? 'registered-student' : 'counselor';
    
    // Update read status for messages sent by the other party
    await ChatMessage.updateMany(
      { 
        $or: [
          { senderId: { $ne: userId }, receiverId: userId },
          { consultationRequest: userId, senderId: { $ne: userId } }
        ],
        read: false 
      },
      { read: true }
    );
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching user chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat history',
      error: error.message
    });
  }
});

// @desc    Mark messages as read for a user
// @route   PUT /api/chat/user/:userId/read
// @access  Private
const markUserMessagesAsRead = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    let userType;
    if (req.adminUser) {
      userType = 'counselor';
    } else if (req.user?.role === 'counselor') {
      userType = 'counselor';
    } else {
      userType = 'registered-student';
    }
    const oppositeType = userType === 'counselor' ? 'registered-student' : 'counselor';
    
    // Mark messages from the other user as read
    await ChatMessage.updateMany(
      { 
        $or: [
          { senderId: { $ne: userId }, receiverId: userId },
          { consultationRequest: userId, senderId: { $ne: userId } }
        ],
        read: false 
      },
      { read: true }
    );
    
    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: error.message
    });
  }
});

// @desc    Delete a chat message
// @route   DELETE /api/chat/delete/:messageId
// @access  Private
const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;
  
  try {
    // Validate messageId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID format'
      });
    }

    // Find the message to check ownership
    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is authorized to delete this message
    let userType;
    if (req.adminUser) {
      userType = 'counselor';
    } else if (req.user?.role === 'counselor') {
      userType = 'counselor';
    } else {
      userType = 'student';
    }

    // Only allow deletion of own messages
    if (message.senderType !== userType) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    // Delete the message
    await ChatMessage.findByIdAndDelete(messageId);
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message',
      error: error.message
    });
  }
});

module.exports = {
  getChatHistory,
  markMessagesAsRead,
  getUserChatHistory,
  markUserMessagesAsRead,
  deleteMessage
};