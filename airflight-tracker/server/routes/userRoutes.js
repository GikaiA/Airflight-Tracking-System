const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Mission = require('../models/Mission');
const auth = require('../middleware/authMiddleware');

// GET user profile by ID route
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('acceptedMissions');
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

    const scoredPilots = pilots.map((pilot) => {
      let score = 0;
      if (pilot.aircraft_qualification.includes(mission.aircraft)) score += 5;
      if (pilot.total_flight_hours >= mission.duration_hours) score += 3;
      if (pilot.nvg_hours >= mission.nvg_hours) score += 2;
      if (pilot.training_completed.includes(mission.training)) score += 4;
      if (pilot.language_proficiency.includes(mission.language)) score += 1;

      return { ...pilot._doc, score };
    }).sort((a, b) => b.score - a.score).slice(0, 3);

    res.json({ mission, pilots: scoredPilots });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post('/acceptMission', auth, async (req, res) => {
  try {
    const { missionId, pilotId } = req.body;
    
    // Fetch the mission details
    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).send('Mission not found');
    }

    // Update the pilot document with the accepted mission details
    const updatedPilot = await User.findByIdAndUpdate(
      pilotId,
      { $push: { acceptedMissions: { mission: missionId, aircraft: mission.aircraft } } },
      { new: true }
    ).populate('acceptedMissions.mission'); // Populate mission details

    if (!updatedPilot) {
      return res.status(404).send('Pilot not found');
    }

    // Respond with the updated pilot document
    res.json({ pilot: updatedPilot });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete('/deleteMission', auth, async (req, res) => {
  try {
    const { userId, missionId } = req.body;

    // Update the user document to remove the mission
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { acceptedMissions: { mission: missionId } } },
      { new: true }
    ).populate('acceptedMissions.mission');

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
