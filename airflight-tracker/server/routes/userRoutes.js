const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET user profile route
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// PUT update user profile
router.put('/profile/:id', async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
