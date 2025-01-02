const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const Permission = require('../../src/models/permission.model');
const Menu = require('../../src/models/menu.model');

let mongoServer;

describe('User API Tests', () => {
  let adminToken;
  let userToken;
  
  beforeAll(async () => {
    // 创建内存数据库
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // 创建测试菜单数据
    await Menu.insertMany([
      {
        title: "系统管理",
        code: "system",
        path: "/system",
        icon: "setting",
        isFolder: true
      },
      {
        title: "用户管理",
        code: "system_users",
        path: "/system/users",
        icon: "user",
        isFolder: false
      }
    ]);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // 清理数据
    await User.deleteMany({});
    await Permission.deleteMany({});
  });

  describe('POST /api/v1/users/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123456',
        gender: 'male',
        mobile: '13800000001',
        birthDate: '1990-01-01'
      };

      const res = await request(app)
        .post('/api/v1/users/register')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe(userData.username);
      expect(res.body.data.password).toBeUndefined();
    });

    it('should fail to register with existing username', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '123456',
        gender: 'male',
        mobile: '13800000001',
        birthDate: '1990-01-01'
      };

      await request(app)
        .post('/api/v1/users/register')
        .send(userData);

      const res = await request(app)
        .post('/api/v1/users/register')
        .send(userData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/users/login', () => {
    beforeEach(async () => {
      // 创建测试用户
      const adminUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: '123456',
        gender: 'male',
        mobile: '13800000001',
        birthDate: '1990-01-01',
        isAdmin: true
      });
      await adminUser.save();

      const normalUser = new User({
        username: 'user',
        email: 'user@example.com',
        password: '123456',
        gender: 'male',
        mobile: '13800000002',
        birthDate: '1990-01-01'
      });
      await normalUser.save();

      // 创建普通用户的权限
      await Permission.create({
        username: 'user',
        menuCodes: ['system_users'],
        createdBy: 'SYSTEM',
        updatedBy: 'SYSTEM'
      });
    });

    it('should login admin successfully with menus', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          username: 'admin',
          password: '123456'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.isAdmin).toBe(true);
      expect(res.body.data.menus).toHaveLength(1);
      expect(res.body.data.menus[0].children).toHaveLength(1);

      adminToken = res.body.data.token;
    });

    it('should login normal user successfully with limited menus', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          username: 'user',
          password: '123456'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.isAdmin).toBe(false);
      expect(res.body.data.menus).toBeDefined();

      userToken = res.body.data.token;
    });

    it('should fail with wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          username: 'admin',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/users/profile', () => {
    it('should get admin profile successfully', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe('admin');
    });

    it('should get user profile successfully', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe('user');
    });

    it('should fail without token', async () => {
      const res = await request(app)
        .get('/api/v1/users/profile');

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/v1/users/profile', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        email: 'newemail@example.com',
        gender: 'female'
      };

      const res = await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(updateData.email);
      expect(res.body.data.gender).toBe(updateData.gender);
    });

    it('should fail to update with invalid data', async () => {
      const updateData = {
        gender: 'invalid'
      };

      const res = await request(app)
        .put('/api/v1/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should allow admin to delete user', async () => {
      const user = await User.findOne({ username: 'user' });

      const res = await request(app)
        .delete(`/api/v1/users/${user._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const deletedUser = await User.findById(user._id);
      expect(deletedUser.isDeleted).toBe(true);
    });

    it('should not allow normal user to delete other users', async () => {
      const admin = await User.findOne({ username: 'admin' });

      const res = await request(app)
        .delete(`/api/v1/users/${admin._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});
