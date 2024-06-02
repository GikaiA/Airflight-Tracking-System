const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    const message = authErrorHandler(error);
    res.status(401).json({ message });
  }
};

const authErrorHandler = (error) => {
  if (error.name === 'TokenExpiredError') {
    return 'Unauthorized: Token has expired';
  } else if (error.name === 'JsonWebTokenError') {
    return 'Unauthorized: Invalid token';
  } else {
    return 'Unauthorized: Authentication failed';
  }
};

module.exports = auth;
