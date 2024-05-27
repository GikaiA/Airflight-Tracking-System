/* eslint-disable no-undef */
//The mongoDB side of things how and what data is stored
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//values being stored for each User
const userSchema = new mongoose.Schema({
    username: { type:String, required: true, unique: true },
    password: { type:String, required: true },
    flight_hrs_ttl: { type: Number, required: true },
    night_hrs:{ type:Number, required: true },
    nvg_hrs:{ type:Number, required: true},
    combat_hrs: { type:Number, required: true},
    combat_sorties: { type:Number, required: true},
    total_sorties:{ type:Number, required: true},
    instructor_time: { type:Number, required: true},
    primary_time: { type:Number, required: true},
    secondary_time: { type:Number, required: true},
})
//hashing passwords for security purposes

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 6);
        }
        next();
})

const User = mongoose.model ('User', userSchema);
module.exports = User; 

