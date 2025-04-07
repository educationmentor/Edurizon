const express = require('express');
const router = express.Router();
const { getChatHistory, markMessagesAsRead } = require('../controllers/chatController');
const auth = require('../middleware/auth');

// Get chat history for a specific consultation
router.get('/:requestId', auth, getChatHistory);

// Mark messages as read
router.put('/:requestId/read', auth, markMessagesAsRead);

module.exports = router;