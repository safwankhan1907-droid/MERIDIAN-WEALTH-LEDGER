const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Route
router.post('/register', async (req, res) => {
  try {
    let { name, email, password } = req.body;
    
    if (!name && email) {
      name = email.split('@')[0];
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful! Please sign in.' });
  } catch (err) {
    console.error('Detailed Register Error:', err.message);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
    
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('Detailed Login Error:', err.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;