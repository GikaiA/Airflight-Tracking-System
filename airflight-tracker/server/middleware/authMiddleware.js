const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  const parts = req.headers.authorization.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).send('Unauthorized: Invalid token format');
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET;

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized: Authentication failed');
  }
};

module.exports = auth;
