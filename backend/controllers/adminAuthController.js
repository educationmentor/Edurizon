const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { AdminUser, ROLES } = require('../models/AdminUser');
const config = require('../config/config');
const sendEmail = require('../utils/email');

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, config.jwt.adminSecret, {
    expiresIn: config.jwt.expiresIn
  });
};

// Send JWT Token Response
const createSendToken = (adminUser, statusCode, res) => {
  const token = signToken(adminUser._id);

  // Remove password from output
  adminUser.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: adminUser
    }
  });
};

// Register new admin user (Super Admin only)
exports.register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      role,
      firstName,
      lastName
    } = req.body;

    // Check if user already exists
    const existingUser = await AdminUser.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email or username already exists'
      });
    }

    // Create new admin user
    const newAdmin = await AdminUser.create({
      username,
      email,
      password,
      role,
      firstName,
      lastName
    });

    createSendToken(newAdmin, 201, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Login admin user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check if user exists && password is correct
    const adminUser = await AdminUser.findOne({ email }).select('+password');
    if (!adminUser || !(await adminUser.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    // Check if user is active
    if (!adminUser.active) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact the super admin.'
      });
    }

    // Update last login
    adminUser.lastLogin = Date.now();
    await adminUser.save({ validateBeforeSave: false });

    // Generate token
    const token = signToken(adminUser._id);

    // Remove password from output
    adminUser.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          _id: adminUser._id,
          email: adminUser.email,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          role: adminUser.role,
          active: adminUser.active
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const adminUser = await AdminUser.findOne({ email: req.body.email });
    if (!adminUser) {
      return res.status(404).json({
        status: 'error',
        message: 'There is no user with this email address'
      });
    }

    // Generate random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    adminUser.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    adminUser.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await adminUser.save({ validateBeforeSave: false });

    // Send reset token email
    const resetURL = `${config.frontendUrl}/admin/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: adminUser.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      adminUser.passwordResetToken = undefined;
      adminUser.passwordResetExpires = undefined;
      await adminUser.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: 'error',
        message: 'There was an error sending the email. Try again later!'
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    // Get user based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const adminUser = await AdminUser.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // If token has not expired, and there is user, set the new password
    if (!adminUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Token is invalid or has expired'
      });
    }

    adminUser.password = req.body.password;
    adminUser.passwordResetToken = undefined;
    adminUser.passwordResetExpires = undefined;
    adminUser.passwordChangedAt = Date.now();
    await adminUser.save();

    createSendToken(adminUser, 200, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const adminUser = await AdminUser.findById(req.adminUser.id).select('+password');

    // Check if current password is correct
    if (!(await adminUser.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        status: 'error',
        message: 'Your current password is wrong'
      });
    }

    // Update password
    adminUser.password = req.body.newPassword;
    adminUser.passwordChangedAt = Date.now();
    await adminUser.save();

    createSendToken(adminUser, 200, res);
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get available roles
exports.getRoles = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      roles: ROLES
    }
  });
}; 