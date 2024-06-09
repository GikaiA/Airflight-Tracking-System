const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rank: { type: String, required: false },
  total_flight_hours: { type: Number, required: false },
  night_hours: { type: Number, required: false },
  nvg_hours: { type: Number, required: false },
  combat_hours: { type: Number, required: false },
  combat_sorties: { type: Number, required: false },
  total_sorties: { type: Number, required: false },
  instructor_time: { type: Number, required: false },
  primary_time: { type: Number, required: false },
  secondary_time: { type: Number, required: false },
  flight_hours: { type: Number, required: false }, // added field for flight_hours
}, { collection: 'pilot' });

const User = mongoose.model('User', userSchema);
module.exports = User;
