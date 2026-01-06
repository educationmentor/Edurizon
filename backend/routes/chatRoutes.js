const express = require('express');
const router = express.Router();
const { getChatHistory, markMessagesAsRead, getUserChatHistory, markUserMessagesAsRead, deleteMessage } = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Get chat history for a specific consultation
router.get('/:requestId', auth, getChatHistory);

// Mark messages as read
router.put('/:requestId/read', auth, markMessagesAsRead);

// Get chat history for a user (student)
router.get('/user/:userId', auth, getUserChatHistory);

// Mark messages as read for a user
router.put('/user/:userId/read', auth, markUserMessagesAsRead);

// Delete a message
router.delete('/delete/:messageId', auth, deleteMessage);

module.exports = router;