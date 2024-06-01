const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// User registration route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            //  Defaults for optional fields if necessary
            // total_flight_hours: 0,
            // night_hours: 0,
            // other fields...
        });
        await newUser.save();
        res.status(201).send('Registration Successful');
    } catch (error) {
        console.error(error);
        res.status(500).send('Registration unsuccessful: ' + error.message);
    }
});


// router.post('/register', async (req, res) => {
//     const { email, username, password } = req.body;

//     // Check if any of the required fields are missing
//     if (!email || !username || !password) {
//         return res.status(400).send('Missing required fields: email, username, or password');
//     }

//     try {
//         // Check for existing user with the same email or username
//         const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//         if (existingUser) {
//             return res.status(409).send('Email or username already exists');
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const newUser = new User({
//             email,
//             username,
//             password: hashedPassword
//         });

//         // Save the new user
//         await newUser.save();
//         res.status(201).send('Registration successful');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Registration unsuccessful');
//     }
// });

// User login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send(`${username} User not found`);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'SECRET_KEY', { expiresIn: '1hr' });
        res.json({ token });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
