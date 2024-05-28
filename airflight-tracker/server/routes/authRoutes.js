const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// User registration route
router.post('/register', async (req, res) => {
    const { username, email, password, flight_hrs_ttl, night_hrs, nvg_hrs, combat_hrs, combat_sorties, total_sorties, instructor_time, primary_time, secondary_time } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            flight_hrs_ttl,
            night_hrs,
            nvg_hrs,
            combat_hrs,
            combat_sorties,
            total_sorties,
            instructor_time,
            primary_time,
            secondary_time
        });
        await newUser.save();
        res.status(201).send('Registration Successful');
    } catch (error) {
        console.error(error);
        res.status(500).send('Registration unsuccessful');
    }
});

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
