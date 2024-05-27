// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];  // Assumes Bearer token
    const decoded = jwt.verify(token, 'your_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized: Invalid token');
  }
};

module.exports = auth;
