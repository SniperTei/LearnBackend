const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    // 构建MongoDB URI
    const host = process.env.MONGODB_HOST || 'localhost';
    const port = process.env.MONGODB_PORT || '27017';
    const database = process.env.MONGODB_DATABASE || 'yolo_database';
    const uri = `mongodb://${host}:${port}/${database}`;

    console.log('\nConnecting to MongoDB...');
    console.log('URI:', uri);

    const conn = await mongoose.connect(uri, options);

    // 获取MongoDB版本信息
    const version = await conn.connection.db.admin().serverInfo().then(info => info.version);

    console.log('\nMongoDB Connection Successful:');
    console.log('---------------------------');
    console.log(`Version: ${version}`);
    console.log(`Host: ${conn.connection.host}`);
    console.log(`Port: ${conn.connection.port}`);
    console.log(`Database: ${conn.connection.name}`);
    console.log('---------------------------\n');

    // 监听数据库事件
    mongoose.connection.on('error', (err) => {
      console.error('\nMongoDB Error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('\nMongoDB Disconnected!');
      console.warn('Attempting to reconnect...\n');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('\nMongoDB Reconnected Successfully!\n');
    });

    return conn;
  } catch (error) {
    console.error('\nMongoDB Connection Failed:');
    console.error('-------------------------');
    console.error(`Error: ${error.message}`);
    console.error('\nConnection Details:');
    console.error(`Host: ${process.env.MONGODB_HOST || 'localhost'}`);
    console.error(`Port: ${process.env.MONGODB_PORT || '27017'}`);
    console.error(`Database: ${process.env.MONGODB_DATABASE || 'yolo_database'}`);
    console.error('\nPossible Solutions:');
    console.error('1. Check if MongoDB is running');
    console.error('2. Verify database connection settings');
    console.error('3. Ensure MongoDB is listening on the specified port');
    console.error('-------------------------\n');

    // 抛出错误让上层处理
    throw error;
  }
};

// 处理进程终止
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('\nError closing MongoDB connection:', err);
    process.exit(1);
  }
});

module.exports = connectDB;
