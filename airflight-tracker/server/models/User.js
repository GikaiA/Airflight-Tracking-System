const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rank: { type: String, default: '' },
  total_flight_hours: { type: Number, default: null },
  nvg_hours: { type: Number, default: null },
  aircraft_qualification: { type: [String], default: [] },
  mission_experience: { type: String, default: '' },
  training_completed: { type: [String], default: [] },
  language_proficiency: { type: [String], default: [] },
  acceptedMissions: [{
    mission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
    aircraft: { type: String },
  }],
  completedMissions: [{
    mission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission' },
    aircraft: { type: String },
    completedAt: { type: Date, default: Date.now }
  }],
  profilePicture: { type: String, default: '/default-profile.png' },
  profilePDF: { type: String, default: '' }
}, { collection: 'pilot' });

const User = mongoose.model('User', userSchema);
module.exports = User;
