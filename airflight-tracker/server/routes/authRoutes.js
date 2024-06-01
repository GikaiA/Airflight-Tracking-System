const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


// User registration route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Received registration request:', req.body);

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.log('User already exists:', existingUser);
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    console.log('User registered successfully:', newUser);
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1hr' });
    res.status(201).json({ message: 'Registration Successful', token, userId: newUser._id });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: 'Registration unsuccessful', error: error.message });
  }
});

// User login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1hr' });
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
