const express = require('express');
const { protectRegisteredStudent } = require('../middleware/registeredStudentAuth');
const {
  getStudentNotifications,
  markNotificationAsRead
} = require('../controllers/studentNotificationController');

const router = express.Router();

router.use(protectRegisteredStudent);

router.get('/notifications', getStudentNotifications);
router.put('/notifications/:notificationId/read', markNotificationAsRead);

module.exports = router;

