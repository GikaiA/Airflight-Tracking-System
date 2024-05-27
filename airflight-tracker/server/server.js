app.listen(5000, ()=> {console.log("Server started on port 5000")})// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/myflighttracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




/*const express = require ('express')
const app= express()

app.get("/api", (req, res) => {
    res.json({"users": ["UserOne" ,"UserTwo", "Uthree", "UserFour" ]})
})

app.listen(5000, ()=> {console.log("Server started on port 5000")})*/