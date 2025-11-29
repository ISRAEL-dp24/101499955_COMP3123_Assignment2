const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'mySuperSecretKey2025'; 


const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid authorization header format' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};


router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!password || (!email && !username)) {
      return res.status(400).json({
        message: 'Password and either email or username are required'
      });
    }

    const user = await User.findOne({
      $or: [
        email ? { email } : null,
        username ? { username } : null
      ].filter(Boolean) 
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'Login successful',
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;
