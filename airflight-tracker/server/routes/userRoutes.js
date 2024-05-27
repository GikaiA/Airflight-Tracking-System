// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

//this is the route to GET user profile
router.get('/profile/:id', async (req, res) => {
    try { 
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);

        } catch (error){
            res.status(500).send(error.message);
        }    

});
module.exports = router;

//Update the user profile route:
router.put('/profile/:id', async (req, res) => {
    const { username, flight_hrs_ttl, night_hrs, nvg_hrs, combat_hrs, combat_sorties, total_sorties, instructor_time, primary_time, secondary_time} = req.body;
    try {
      const user = await User.findByIdAndUpdate(req.params.id, { username, flight_hrs_ttl, night_hrs, nvg_hrs, combat_hrs, combat_sorties, total_sorties, instructor_time, primary_time, secondary_time }, { new: true });
      if (!user) return res.status(404).send('User not found');
      res.json(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  module.exports = router;
  