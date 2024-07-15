const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Mission = require('../models/Mission');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');

// Multer configuration for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/profilePictures');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only image files are allowed.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// POST route to upload profile picture
router.post('/profile/:id/uploadProfilePicture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.profilePicture = req.file.path;
    await user.save();

    res.json({ profilePicture: req.file.path });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

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

// PUT route to update user profile
router.put('/profile/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      email,
      rank,
      total_flight_hours,
      nvg_hours,
      aircraft_qualification,
      training_completed,
      language_proficiency,
    } = req.body;

    // Prepare updates object with only provided fields
    const updates = {};
    if (email) updates.email = email;
    if (rank) updates.rank = rank;
    if (total_flight_hours) updates.total_flight_hours = total_flight_hours;
    if (nvg_hours) updates.nvg_hours = nvg_hours;
    if (aircraft_qualification) updates.aircraft_qualification = aircraft_qualification.split(',').map(item => item.trim());
    if (training_completed) updates.training_completed = training_completed.split(',').map(item => item.trim());
    if (language_proficiency) updates.language_proficiency = language_proficiency.split(',').map(item => item.trim());

    // Find user by ID and update with new data
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    // Handle case where user is not found
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Respond with updated user object
    res.json(user);
  } catch (error) {
    // Handle other potential errors
    if (error.code === 11000) {
      res.status(400).send('Duplicate key error: Email already exists');
    } else {
      res.status(500).send(error.message);
    }
  }
});

// GET recommended missions for user route
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

// POST route to find pilots for a mission
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
        { language_proficiency: { $in: [mission.language] } },
      ],
    }).collation({ locale: 'en', strength: 2 });

    const scoredPilots = pilots
      .map((pilot) => {
        let score = 0;
        if (pilot.aircraft_qualification.includes(mission.aircraft)) score += 5;
        if (pilot.total_flight_hours >= mission.duration_hours) score += 3;
        if (pilot.nvg_hours >= mission.nvg_hours) score += 2;
        if (pilot.training_completed.includes(mission.training)) score += 4;
        if (pilot.language_proficiency.includes(mission.language)) score += 1;

        return { ...pilot._doc, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    res.json({ mission, pilots: scoredPilots });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST route to accept a mission with a specific pilot
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

// DELETE route to delete a mission from a user's accepted missions
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
