const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Verify token endpoint
router.get('/verify', (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ valid: false });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.json({ valid: false });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Token is valid
    return res.json({ 
      valid: true, 
      userId: decoded.id,
      exp: decoded.exp
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.json({ valid: false });
  }
});

module.exports = router;