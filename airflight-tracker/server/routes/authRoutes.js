const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// User registration route
router.post('/register', async (req, res) => {
    console.log("Received register request", req.body);
    const { username, email, password } = req.body;

    try {
        // Check for existing user by username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists' });
        }

        // Hash password and create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1hr' });
        res.status(201).json({ message: 'Registration Successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration unsuccessful', error: error.message });
    }
});

module.exports = router;
