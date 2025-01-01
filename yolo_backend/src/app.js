const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const moment = require('moment');
const path = require('path');

// 根据环境加载对应的配置文件
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev';
require('dotenv').config({ path: path.join(__dirname, '..', envFile) });

const connectDB = require('./config/database');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Custom middleware to add timestamp to requests
app.use((req, res, next) => {
  req.requestTime = moment().format();
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to YOLO Backend API',
    timestamp: req.requestTime,
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('\nRequest Error:');
  console.error('---------------');
  console.error('Path:', req.path);
  console.error('Method:', req.method);
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  console.error('---------------\n');

  res.status(err.status || 500).json({ 
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
    timestamp: moment().format()
  });
});

// 异步启动函数
const startServer = async () => {
  try {
    // 先尝试连接数据库
    await connectDB();
    
    // 数据库连接成功后启动服务器
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log('\nServer Information:');
      console.log('------------------');
      console.log(`Status: Running`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Port: ${PORT}`);
      console.log(`Config: ${envFile}`);
      console.log('------------------\n');
    });
  } catch (error) {
    console.error('\nServer Startup Error:');
    console.error('-------------------');
    console.error('Type:', error.name);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('-------------------\n');
    process.exit(1);
  }
};

// 启动服务器
startServer();
