const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const url = 'mongodb://localhost:27017/sniper_db';
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;