const express = require('express');
const adminAuthController = require('../controllers/adminAuthController');
const adminUserController = require('../controllers/adminUserController');
const { protectAdminRoute, restrictTo, isSuperAdmin } = require('../middleware/adminAuth');
const {getAllCounsellors} = require('../controllers/adminCounsellorAdminController');
const {
  scheduleMeeting,
  getAdminMeetings,
  getUserMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  cleanupOldMeetings
} = require('../controllers/adminMeetingController');
const router = express.Router();

// Public routes
router.post('/login', adminAuthController.login);
router.post('/forgot-password', adminAuthController.forgotPassword);
router.patch('/reset-password/:token', adminAuthController.resetPassword);
router.get('/validate-token', protectAdminRoute, adminAuthController.validateToken);


// backend route
router.post("/impersonate/:id",adminAuthController.impersonate);

// Counsellor Admin Routes
router.get('/getAllcounsellors', getAllCounsellors);
  
// Protected routes
router.use(protectAdminRoute);

// User management routes (Super Admin only)
router.get('/users', isSuperAdmin, adminUserController.getAllUsers);
router.patch('/users/:userId/toggle-access', isSuperAdmin, adminUserController.toggleAccess);
router.delete('/users/:userId', isSuperAdmin, adminUserController.removeUser);

// Admin user routes
router.post('/register', isSuperAdmin, adminAuthController.register);
router.patch('/update-password', adminAuthController.updatePassword);
router.get('/roles', adminAuthController.getRoles);

// Digital Team Routes
router.patch('/addVideoData/:id',adminAuthController.addVideoData)
router.patch('/updateVideoData/:id', adminAuthController.updateVideoData);
router.delete('/deleteVideoData/:id', adminAuthController.deleteVideoData);
router.patch('/updateVideoField/:id', adminAuthController.updateVideoField);
router.get('/getAllDigitalVideos', adminAuthController.getAllDigitalVideos);

// Meeting Routes
router.get('/users', adminAuthController.getAllAdminUsers);
router.post('/schedule-meeting', scheduleMeeting);
router.get('/meetings', getAdminMeetings);
router.get('/meetings/user/:id', getUserMeetings);
router.get('/meetings/:id', getMeetingById);
router.put('/meetings/:id', updateMeeting);
router.delete('/meetings/:id', deleteMeeting);
router.post('/meetings/cleanup', cleanupOldMeetings);

module.exports = router; 