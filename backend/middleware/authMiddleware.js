// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header (expects 'Bearer <token>')
  const token = req.header('Authorization')?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user payload to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
