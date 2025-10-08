const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protectAdminRoute } = require('../middleware/adminAuth');

// Record attendance (called during login)
router.post('/record', protectAdminRoute, attendanceController.recordAttendance);

// Record logout
router.post('/logout', protectAdminRoute, attendanceController.recordLogout);

// Get attendance for a specific admin
router.get('/admin/:adminId', protectAdminRoute, attendanceController.getAdminAttendance);

// Get all attendance records (super admin only)
router.get('/all', protectAdminRoute, attendanceController.getAllAttendance);

// Get attendance summary for dashboard
router.get('/summary', protectAdminRoute, attendanceController.getAttendanceSummary);

module.exports = router;
