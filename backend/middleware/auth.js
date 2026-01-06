const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { RegisteredStudent } = require('../models/registeredUserModel');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'No valid authorization header found' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token found' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database - check both User and RegisteredStudent models
      let user = await User.findById(decoded.id).select('-password');
      let userModel = 'User';
      
      if (!user) {
        user = await RegisteredStudent.findById(decoded.id).select('-password');
        userModel = 'RegisteredStudent';
      }
      
      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      // Remove the counselor check - allow all authenticated users
      // Add user to request object
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

module.exports = auth;