const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Mission = require('../models/Mission');
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

router.get('/recommendedMissions/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const missions = await Mission.find({});
    const recommendedMissions = missions
      .map((mission) => {
        let score = 0;
        if (user.aircraft_qualification.includes(mission.aircraft)) score += 5;
        if (user.total_flight_hours >= mission.duration_hours) score += 3;
        if (user.nvg_hours >= mission.nvg_hours) score += 2;
        if (user.training_completed.includes(mission.training)) score += 4;
        if (user.language_proficiency.includes(mission.language)) score += 1;

        return { ...mission._doc, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Get top 3 missions

    res.json(recommendedMissions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/findPilot', auth, async (req, res) => {
  try {
    const { missionId } = req.body;
    const mission = await Mission.findById(missionId);

    if (!mission) {
      return res.status(404).send('Mission not found');
    }

    const pilots = await User.find({
      $or: [
        { aircraft_qualification: { $in: [mission.aircraft] } },
        { training_completed: { $in: [mission.training] } },
        { language_proficiency: { $in: [mission.language] } }
      ]
    }).collation({ locale: 'en', strength: 2 });

    res.json({ mission, pilots });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST route to search pilots based on usernames
router.post('/findPilotByName', async (req, res) => {
  try {
    console.log(res);
    const { query } = req.body;
    const searchQuery = {};

    if (query.username) {
      console.log(query.username);
      searchQuery.username = new RegExp(query.username, 'i'); // Case-insensitive search
      console.log(searchQuery);
    }

    const pilots = await User.find(searchQuery);
    res.json(pilots);
  } catch (error) {
    console.error('Error finding pilots:', error);
    res.status(500).json({ error: error.message });
  }
  /*
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const searchQuery = {
      name: new RegExp(name, 'i') // Case-insensitive search
    };

    const pilots = await User.find(searchQuery);
    res.json(pilots);
  } catch (error) {
    console.error('Error finding pilots:', error);
    res.status(500).json({ error: error.message });
  }*/
});


module.exports = router;
