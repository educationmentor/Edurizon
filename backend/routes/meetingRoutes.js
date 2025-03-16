const express = require('express');
const { 
    getMeetings, 
    updateMeetingStatus, 
    createMeeting, 
    getMeetingStatus 
} = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');  // Changed from middlewares to middleware
const router = express.Router();

router.route('/').get(protect, getMeetings);
router.route('/create').post(protect, createMeeting);
router.route('/status/:universityId').get(protect, getMeetingStatus);
router.route('/:id').put(protect, updateMeetingStatus);

module.exports = router;