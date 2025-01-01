const { verifyToken } = require('../utils/jwt');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      throw new Error();
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = auth;
