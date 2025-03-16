const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid auth header found');
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no valid authorization header'
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);

      const user = await User.findById(decoded.id).select('-password');
      console.log('Found user:', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });

      if (!user) {
        console.log('No user found with token ID');
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

module.exports = { protect };