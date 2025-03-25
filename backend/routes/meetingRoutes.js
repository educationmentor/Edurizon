const express = require('express');
const { 
    getMeetings, 
    updateMeetingStatus, 
    createMeeting, 
    getMeetingStatus, 
    joinMeeting // Add this
} = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getMeetings);
router.route('/create').post(protect, createMeeting);
router.route('/status/:universityId').get(protect, getMeetingStatus);
router.route('/:id').put(protect, updateMeetingStatus);
router.route('/join/:id').get(protect, joinMeeting); // Add this route

module.exports = router;