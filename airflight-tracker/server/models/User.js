const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true }, // Add email field
    password: { type: String, required: true },
    total_flight_hours: { type: Number, required: true },
    night_hours: { type: Number, required: true },
    nvg_hours: { type: Number, required: true },
    combat_hours: { type: Number, required: true },
    combat_sorties: { type: Number, required: true },
    total_sorties: { type: Number, required: true },
    instructor_time: { type: Number, required: true },
    primary_time: { type: Number, required: true },
    secondary_time: { type: Number, required: true },
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
