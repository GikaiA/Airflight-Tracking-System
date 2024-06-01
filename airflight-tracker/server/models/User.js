const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    total_flight_hours: { type: Number, required: false },  // Made optional
    night_hours: { type: Number, required: false },
    nvg_hours: { type: Number, required: false },
    combat_hours: { type: Number, required: false },
    combat_sorties: { type: Number, required: false },
    total_sorties: { type: Number, required: false },
    instructor_time: { type: Number, required: false },
    primary_time: { type: Number, required: false },
    secondary_time: { type: Number, required: false },
});

// Hashing passwords for security purposes
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); // Using 10 rounds
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
