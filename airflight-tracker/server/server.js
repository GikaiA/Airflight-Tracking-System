const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();  // Ensure 'app' is initialized before any operations are performed on it

app.use(bodyParser.json());  // Middleware for parsing JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost/myflighttracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Use environment variable for the port or default to 3000 if not set
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