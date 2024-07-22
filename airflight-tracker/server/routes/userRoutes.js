const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Mission = require('../models/Mission');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { ObjectId } = require('mongoose').Types;

// Ensure upload directory exists
const uploadDir = './uploads/profileFiles';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profileFiles/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route to upload profile picture
router.post('/profile/:id/upload', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.profilePicture = `uploads/profileFiles/${req.file.filename}`;
    await user.save();

    res.json({ profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to get user profile by ID
router.get('/profile/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(userId).populate('acceptedMissions.mission');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to update user profile
router.put('/profile/:id', auth, upload.single('profileFile'), async (req, res) => {
  try {
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const {
      email,
      rank,
      total_flight_hours,
      nvg_hours,
      aircraft_qualification,
      training_completed,
      language_proficiency,
    } = req.body;

    const updates = {};
    if (email) updates.email = email;
    if (rank) updates.rank = rank;
    if (total_flight_hours) updates.total_flight_hours = total_flight_hours;
    if (nvg_hours) updates.nvg_hours = nvg_hours;
    if (aircraft_qualification) updates.aircraft_qualification = aircraft_qualification;
    if (training_completed) updates.training_completed = training_completed;
    if (language_proficiency) updates.language_proficiency = language_proficiency;
    if (req.file) {
      updates.profilePicture = req.file.path;
    }

    console.log('Updating user with:', updates);

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

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

// Route to get recommended missions for user
router.get('/recommendedMissions/:id', auth, async (req, res) => {
  try {
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);
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
      .slice(0, 3);

    res.json(recommendedMissions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to find pilots for a mission
router.post('/findPilot', auth, async (req, res) => {
  try {
    const { missionId } = req.body;
    if (!ObjectId.isValid(missionId)) {
      return res.status(400).json({ message: 'Invalid mission ID' });
    }

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

// Route to accept a mission
router.post('/acceptMission', async (req, res) => {
  const { userId, missionId } = req.body;

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(missionId)) {
    return res.status(400).json({ message: 'Invalid userId or missionId' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const mission = await Mission.findById(missionId);
    if (!mission) {
      return res.status(404).json({ message: 'Mission not found' });
    }

    user.acceptedMissions.push({ mission: missionId, aircraft: 'defaultAircraft' });
    await user.save();

    res.status(200).json({ message: 'Mission accepted successfully' });
  } catch (error) {
    console.error('Error in acceptMission route:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Route to delete a mission from a user's accepted missions
router.delete('/deleteMission', auth, async (req, res) => {
  const { userId, missionId } = req.body;

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(missionId)) {
    return res.status(400).json({ message: 'Invalid userId or missionId' });
  }

  try {
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

// Route to complete a mission
router.post('/completeMission', auth, async (req, res) => {
  const { userId, missionId } = req.body;

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(missionId)) {
    return res.status(400).json({ message: 'Invalid userId or missionId' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const missionIndex = user.acceptedMissions.findIndex(
      (m) => m.mission.toString() === missionId
    );

    if (missionIndex === -1) {
      return res.status(404).json({ message: 'Mission not found in accepted missions' });
    }

    const completedMission = user.acceptedMissions[missionIndex];
    user.acceptedMissions.splice(missionIndex, 1);
    user.completedMissions.push({ mission: completedMission.mission, aircraft: completedMission.aircraft });

    await user.save();

    const populatedUser = await User.findById(userId).populate('acceptedMissions.mission completedMissions.mission');
    res.status(200).json({ message: 'Mission completed successfully', user: populatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Route to clear a completed mission
router.delete('/clearCompletedMission', auth, async (req, res) => {
  const { userId, missionId } = req.body;

  if (!ObjectId.isValid(userId) || !ObjectId.isValid(missionId)) {
    return res.status(400).json({ message: 'Invalid userId or missionId' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { completedMissions: { mission: missionId } } },
      { new: true }
    ).populate('acceptedMissions.mission completedMissions.mission');

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to get copilot for mission
router.get('/copilot/:missionId', auth, async (req, res) => {
  try {
    const missionId = req.params.missionId;
    const userId = req.user.id;

    if (!ObjectId.isValid(missionId) || !ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid missionId or userId' });
    }

    const user = await User.findById(userId).populate('acceptedMissions.mission');
    if (!user) {
      return res.status(404).send('User not found');
    }

    const acceptedMission = user.acceptedMissions.find(m => m.mission._id.toString() === missionId);
    if (!acceptedMission) {
      return res.status(404).send('Accepted mission not found');
    }

    const copilot = await User.findOne({ "acceptedMissions.mission": missionId });
    if (!copilot) {
      return res.status(404).send('Copilot not found');
    }

    res.json(copilot);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
