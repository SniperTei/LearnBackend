const mongoose = require('mongoose');
const path = require('path');

// 加载环境变量
require('dotenv').config({ path: path.join(__dirname, '../../.env.dev') });

async function testConnection() {
    try {
        const host = process.env.MONGODB_HOST || 'localhost';
        const port = process.env.MONGODB_PORT || '27017';
        const database = process.env.MONGODB_DATABASE || 'yolo_database';
        const uri = `mongodb://${host}:${port}/${database}`;

        console.log('\nTesting MongoDB Connection:');
        console.log('-------------------------');
        console.log('Connection URI:', uri);
        console.log('Environment:', process.env.NODE_ENV || 'development');

        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });

        console.log('\nConnection Successful!');
        console.log('-------------------------');
        console.log('MongoDB Version:', await conn.connection.db.admin().serverInfo().then(info => info.version));
        console.log('Database Name:', conn.connection.name);
        console.log('Host:', conn.connection.host);
        console.log('Port:', conn.connection.port);

        // 测试数据库写入
        const testCollection = conn.connection.db.collection('connection_test');
        await testCollection.insertOne({ 
            test: 'Connection successful', 
            timestamp: new Date() 
        });
        console.log('\nTest write successful!');

        // 测试数据库读取
        const testDoc = await testCollection.findOne({ test: 'Connection successful' });
        console.log('Test read successful!');
        console.log('Retrieved document:', testDoc);

        // 清理测试数据
        await testCollection.deleteMany({ test: 'Connection successful' });
        console.log('Test cleanup successful!');
        
        await mongoose.connection.close();
        console.log('\nConnection closed successfully');
        process.exit(0);
    } catch (error) {
        console.error('\nConnection Error:');
        console.error('-------------------------');
        console.error('Error Type:', error.name);
        console.error('Error Message:', error.message);
        console.error('Host:', process.env.MONGODB_HOST);
        console.error('Port:', process.env.MONGODB_PORT);
        console.error('Database:', process.env.MONGODB_DATABASE);
        
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }
        process.exit(1);
    }
}

testConnection();
