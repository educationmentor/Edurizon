const jwt = require('jsonwebtoken');
const { RegisteredStudent } = require('../models/registeredUserModel');

const protectRegisteredStudent = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no valid authorization header'
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await RegisteredStudent.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if account is active
      if (user.accountStatus !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Account is inactive or suspended. Please contact support.'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, token expired'
        });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, invalid token'
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

module.exports = { protectRegisteredStudent };

