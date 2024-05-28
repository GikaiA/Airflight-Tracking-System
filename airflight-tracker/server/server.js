/*require('dotenv').config();  // Load environment variables from .env file at the start

const express = require('express');
const connectDB = require('./db');  // Ensure the path to db.js is correct
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Establish MongoDB connection
connectDB();

const app = express();  // Ensure 'app' is initialized before any operations are performed on it

app.use(express.json());  // Middleware for parsing JSON bodies, now using built-in express method

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Use environment variable for the port or default to 3000 if not set
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { 
    console.log(`Server is running on http://localhost:${PORT}`);
});*/

require('dotenv').config();  // Load environment variables from .env file at the start

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./db');  // Ensure the path to db.js is correct
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Establish MongoDB connection
connectDB();

const app = express();  // Ensure 'app' is initialized before any operations are performed on it

app.use(cors({
    origin: 'http://localhost:3000', // Adjust this depending on your front-end URL
    credentials: true
})); // Enable CORS

app.use(helmet()); // Secure your app by setting various HTTP headers

app.use(express.json());  // Middleware for parsing JSON bodies

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Use environment variable for the port or default to 3000 if not set
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

