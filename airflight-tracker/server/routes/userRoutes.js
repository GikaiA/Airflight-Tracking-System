const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// GET user profile route
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

router.put('/profile/:id', auth, async (req, res) => {
  try {
    const {
      email,
      rank,
      total_flight_hours,
      nvg_hours,
      aircraft_qualification,
      training_completed,
      language_proficiency,
    } = req.body;

    if (!email) {
      return res.status(400).send('Email is required');
    }

    const updates = {
      email,
      rank,
      total_flight_hours,
      nvg_hours,
      aircraft_qualification, // Already an array
      training_completed, // Already an array
      language_proficiency, // Already an array
    };

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send('Duplicate key error: Email already exists');
    } else {
      res.status(500).send(error.message);
    }
  }
});

// POST route to find pilots based on filters
router.post('/findPilot', async (req, res) => {
  try {
    const { rank, totalFlightHours, nvgHours, flightHours } = req.body;
    const query = {};

    if (rank) query.rank = rank;

    if (totalFlightHours) {
      if (totalFlightHours === '3001+') {
        query.total_flight_hours = { $gte: 3001 };
      } else {
        const [min, max] = totalFlightHours.split('-').map(Number);
        query.total_flight_hours = { $gte: min, $lte: max };
      }
    }

    if (nvgHours) {
      if (nvgHours === '3001+') {
        query.nvg_hours = { $gte: 3001 };
      } else {
        const [min, max] = nvgHours.split('-').map(Number);
        query.nvg_hours = { $gte: min, $lte: max };
      }
    }

    if (flightHours) {
      if (flightHours === '3001+') {
        query.flight_hours = { $gte: 3001 };
      } else {
        const [min, max] = flightHours.split('-').map(Number);
        query.flight_hours = { $gte: min, $lte: max };
      }
    }

    const pilots = await User.find(query);
    res.json(pilots);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
