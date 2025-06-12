const express = require('express');
const adminAuthController = require('../controllers/adminAuthController');
const adminUserController = require('../controllers/adminUserController');
const { protectAdminRoute, restrictTo, isSuperAdmin } = require('../middleware/adminAuth');
const { ROLES } = require('../models/AdminUser');

const router = express.Router();

// Public routes
router.post('/login', adminAuthController.login);
router.post('/forgot-password', adminAuthController.forgotPassword);
router.patch('/reset-password/:token', adminAuthController.resetPassword);
router.get('/validate-token', protectAdminRoute, adminAuthController.validateToken);


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

module.exports = router; 