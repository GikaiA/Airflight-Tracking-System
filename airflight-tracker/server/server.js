require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./db');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Establish MongoDB connection
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3001',  // or the specific URL of your frontend application
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization', // Ensure Authorization header is allowed
  exposedHeaders: ['Content-Length', 'X-Response-Time']  // Add other headers needed by the frontend
};

app.use(cors(corsOptions));

app.use(helmet({
  crossOriginResourcePolicy: false,  // This disables the cross-origin resource policy
}));
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
