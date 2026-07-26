const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'replace_with_a_long_secret';

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired authentication token.' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Access denied. Authentication token required.' });
  }
};

module.exports = {
  authenticateJWT
};
