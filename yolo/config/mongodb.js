const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // url
    const url = 'mongodb://localhost:27017/yolo_db';
    await mongoose.connect(url, {
      
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
const database = mongoose.connection;
database.on('a error', err => {
  console.error(err.message);
});
database.once('open', () => {
  console.log('a MongoDB connected...');
});

module.exports = connectDB;