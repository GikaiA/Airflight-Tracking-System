const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
  mission_id: { type: String, required: true, unique: true },
  aircraft: { type: String, required: true },
  duration_hours: { type: Number, required: true },
  destination: { type: String, required: true },
  mission_type: { type: String, required: true },
  specific_mission: { type: String, required: true },
}, { collection: 'mission' });

module.exports = mongoose.model('Mission', MissionSchema);
