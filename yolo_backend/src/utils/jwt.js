const jwt = require('jsonwebtoken');

const generateToken = (userId, isAdmin, username) => {
  return jwt.sign(
    { 
      userId, 
      isAdmin: isAdmin || false,
      username
    }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
