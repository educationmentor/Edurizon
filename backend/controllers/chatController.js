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
    const userType = req.user.role === 'counselor' ? 'counselor' : 'student';
    const oppositeType = userType === 'counselor' ? 'student' : 'counselor';
    
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

    const userType = req.user.role === 'counselor' ? 'counselor' : 'student';
    const oppositeType = userType === 'counselor' ? 'student' : 'counselor';
    
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

module.exports = { 
  getChatHistory,
  markMessagesAsRead
};