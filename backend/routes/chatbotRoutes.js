const express = require('express');
const router = express.Router();
const {sendChatBotRequest}=require('../controllers/chatbotController')

router.post('/send', sendChatBotRequest);

module.exports = router;