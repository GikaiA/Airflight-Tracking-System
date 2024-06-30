const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// GET user profile by ID route
router.get('/profile/:id', auth, async (req, res) => {
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
router.put('/profile/:id', auth, async (req, res) => {
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

// POST route to find pilots based on filters
router.post('/findPilot', async (req, res) => {
  try {
    const { rank, totalFlightHours, nvgHours, flightHours } = req.body;
    const query = {};

    if (rank) query.rank = rank;
    if (totalFlightHours) {
      const totalFlightHoursRange = totalFlightHours.split('-').map(Number);
      query.total_flight_hours = { $gte: totalFlightHoursRange[0], $lte: totalFlightHoursRange[1] };
    }
    if (nvgHours) {
      const nvgHoursRange = nvgHours.split('-').map(Number);
      query.nvg_hours = { $gte: nvgHoursRange[0], $lte: nvgHoursRange[1] };
    }
    if (flightHours) {
      const flightHoursRange = flightHours.split('-').map(Number);
      query.flight_hours = { $gte: flightHoursRange[0], $lte: flightHoursRange[1] };
    }

    const pilots = await User.find(query);
    res.json(pilots);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// GET user profile by username route
router.get('/profile/username/:username', auth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
