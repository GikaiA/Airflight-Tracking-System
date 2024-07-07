const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Mission = require('../models/Mission');
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

router.get('/recommendedMissions', auth, async (req, res) => {
  try {
    const missions = await Mission.find({});
    res.json(missions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/findPilot', auth, async (req, res) => {
  try {
    const { missionId } = req.body;
    // Fetch pilots available for the selected mission
    const pilots = await User.find({ aircraft_qualification: missionId });
    res.json(pilots);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Function to fetch pilots for a specific mission (implement your logic)
async function getPilotsForMission(missionId) {
  // Placeholder logic, replace with your actual implementation
  return await User.find({ missionId });
}

module.exports = router;
