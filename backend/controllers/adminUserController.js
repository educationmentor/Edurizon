const { AdminUser } = require('../models/AdminUser');

// Get all admin users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await AdminUser.find()
      .select('-password -passwordChangedAt -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Toggle user access
exports.toggleAccess = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Prevent super-admin from being deactivated
    if (user.role === 'super-admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Super admin access cannot be modified'
      });
    }

    user.active = !user.active;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Remove user
exports.removeUser = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Prevent super-admin from being deleted
    if (user.role === 'super-admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Super admin cannot be deleted'
      });
    }

    await AdminUser.findByIdAndDelete(req.params.userId);

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
}; 