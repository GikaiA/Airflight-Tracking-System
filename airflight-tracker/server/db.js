const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);  // Exit process with failure
  }
};

module.exports = connectDB;
