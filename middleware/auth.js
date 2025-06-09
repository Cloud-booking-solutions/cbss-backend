const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    console.log('Auth header received:', authHeader);
    
    if (!authHeader) {
      console.log('No Authorization header found');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted token:', token);

    if (!token) {
      console.log('No token found after Bearer prefix');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      console.log('Using secret key:', secret.substring(0, 3) + '...');
      
      const decoded = jwt.verify(token, secret);
      console.log('Token verified successfully:', decoded);

      // Add user from payload
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.status(401).json({ message: 'Token verification failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = auth;