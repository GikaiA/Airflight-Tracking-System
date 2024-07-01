const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rank: { type: String, required: false },
  total_flight_hours: { type: Number, required: false },
  nvg_hours: { type: Number, required: false },
  aircraft_qualification: { type: [String], required: false },
  mission_experience: { type: String, required: false },
  training_completed: { type: [String], required: false },
  language_proficiency: { type: [String], required: false }
}, { collection: 'pilot' });

const User = mongoose.model('User', userSchema);
module.exports = User;
