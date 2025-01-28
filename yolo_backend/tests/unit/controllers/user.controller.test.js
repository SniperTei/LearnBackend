const UserController = require('../../../src/controllers/user.controller');
const UserService = require('../../../src/services/user.service');
const Menu = require('../../../src/models/menu.model');
const Response = require('../../../src/utils/response');

jest.mock('../../../src/services/user.service');
jest.mock('../../../src/models/menu.model');

describe('UserController', () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    controller = new UserController();
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: {
        userId: 'testUserId',
        username: 'testUser'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validUserData = {
      username: 'newuser',
      password: 'password123',
      email: 'test@example.com',
      gender: 'male',
      birthDate: '1990-01-01',
      mobile: '1234567890'
    };

    it('should register new user successfully', async () => {
      mockReq.body = validUserData;
      const mockResult = {
        user: { ...validUserData, _id: 'testUserId' },
        token: 'testToken'
      };

      jest.spyOn(controller.userService, 'getUserByUsername')
        .mockResolvedValue(null);
      jest.spyOn(controller.userService, 'register')
        .mockResolvedValue(mockResult);

      await controller.register(mockReq, mockRes);

      expect(controller.userService.getUserByUsername).toHaveBeenCalledWith('newuser');
      expect(controller.userService.register).toHaveBeenCalledWith(validUserData);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockResult,
          msg: 'User registered successfully'
        })
      );
    });

    it('should return 400 when username already exists', async () => {
      mockReq.body = validUserData;
      jest.spyOn(controller.userService, 'getUserByUsername')
        .mockResolvedValue({ username: 'newuser' });

      await controller.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000001',
          msg: 'Username already exists'
        })
      );
    });
  });

  describe('login', () => {
    const loginData = {
      username: 'testuser',
      password: 'password123'
    };

    it('should login successfully as admin', async () => {
      mockReq.body = loginData;
      const mockUser = { 
        _id: 'testUserId',
        username: 'testuser',
        isAdmin: true
      };
      const mockLoginResult = {
        user: mockUser,
        permissions: { menuCodes: ['system', 'user'] },
        token: 'testToken'
      };
      const mockMenus = [
        { code: 'system', sort: 1, toObject: () => ({ code: 'system' }) },
        { code: 'user', sort: 2, toObject: () => ({ code: 'user' }) }
      ];

      jest.spyOn(controller.userService, 'login')
        .mockResolvedValue(mockLoginResult);
      Menu.find.mockReturnValue({
        sort: () => mockMenus
      });

      await controller.login(mockReq, mockRes);

      expect(controller.userService.login).toHaveBeenCalledWith('testuser', 'password123');
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: expect.objectContaining({
            token: 'testToken',
            user: expect.objectContaining({
              permissions: ['system', 'user']
            })
          }),
          msg: 'Login successful'
        })
      );
    });

    it('should return 400 when username or password is missing', async () => {
      mockReq.body = { username: 'testuser' };

      await controller.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000001',
          msg: 'Username and password are required'
        })
      );
    });
  });

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      const mockUser = {
        _id: 'testUserId',
        username: 'testuser',
        email: 'test@example.com',
        gender: 'male',
        birthDate: '1990-01-01',
        mobile: '1234567890',
        avatarUrl: 'test.jpg',
        lastLoginAt: new Date()
      };

      jest.spyOn(controller.userService, 'getUserById')
        .mockResolvedValue(mockUser);

      await controller.getProfile(mockReq, mockRes);

      expect(controller.userService.getUserById).toHaveBeenCalledWith('testUserId');
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: expect.objectContaining({
            username: mockUser.username,
            email: mockUser.email
          })
        })
      );
    });

    it('should return 404 when user not found', async () => {
      jest.spyOn(controller.userService, 'getUserById')
        .mockResolvedValue(null);

      await controller.getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000001',
          msg: 'User not found'
        })
      );
    });
  });

  describe('updateProfile', () => {
    const updateData = {
      email: 'newemail@example.com',
      gender: 'female',
      mobile: '9876543210'
    };

    it('should update profile successfully', async () => {
      mockReq.body = updateData;
      const mockUser = {
        _id: 'testUserId',
        username: 'testuser',
        save: jest.fn()
      };

      jest.spyOn(controller.userService, 'getUserById')
        .mockResolvedValue(mockUser);

      await controller.updateProfile(mockReq, mockRes);

      expect(mockUser.save).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          msg: 'Profile updated successfully'
        })
      );
    });
  });

  describe('listUsers', () => {
    it('should list users with filters', async () => {
      mockReq.query = {
        page: '2',
        limit: '20',
        username: 'test',
        email: 'test@',
        isAdmin: 'true'
      };

      const mockResult = {
        users: [{ username: 'testuser' }],
        total: 1,
        page: 2,
        totalPages: 1
      };

      jest.spyOn(controller.userService, 'listUsers')
        .mockResolvedValue(mockResult);

      await controller.listUsers(mockReq, mockRes, mockNext);

      expect(controller.userService.listUsers).toHaveBeenCalledWith(
        expect.objectContaining({
          username: expect.any(RegExp),
          email: expect.any(RegExp),
          isAdmin: true
        }),
        { page: '2', limit: '20' }
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockResult
        })
      );
    });
  });

  describe('updateUserMenus', () => {
    it('should update user menus successfully', async () => {
      mockReq.params = { userId: 'targetUserId' };
      mockReq.body = {
        menuCodes: ['system', 'user'],
        isAdmin: false
      };

      const mockResult = {
        userId: 'targetUserId',
        menuCodes: ['system', 'user']
      };

      jest.spyOn(controller.userService, 'updateUserMenus')
        .mockResolvedValue(mockResult);

      await controller.updateUserMenus(mockReq, mockRes, mockNext);

      expect(controller.userService.updateUserMenus).toHaveBeenCalledWith(
        'targetUserId',
        {
          menuCodes: ['system', 'user'],
          isAdmin: false
        }
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockResult
        })
      );
    });
  });

  describe('getUserMenus', () => {
    it('should get user menus successfully', async () => {
      mockReq.params = { userId: 'targetUserId' };
      const mockResult = {
        menuCodes: ['system', 'user'],
        isAdmin: false
      };

      jest.spyOn(controller.userService, 'getUserMenus')
        .mockResolvedValue(mockResult);

      await controller.getUserMenus(mockReq, mockRes, mockNext);

      expect(controller.userService.getUserMenus).toHaveBeenCalledWith('targetUserId');
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockResult
        })
      );
    });
  });

  describe('buildMenuTree', () => {
    it('should build menu tree correctly', () => {
      const controller = new UserController();
      const menus = [
        {
          code: 'system',
          name: '系统管理',
          sort: 1,
          toObject: () => ({
            code: 'system',
            name: '系统管理',
            sort: 1
          })
        },
        {
          code: 'system_user',
          name: '用户管理',
          sort: 1,
          toObject: () => ({
            code: 'system_user',
            name: '用户管理',
            sort: 1
          })
        }
      ];

      const menuTree = require('../../../src/controllers/user.controller').buildMenuTree(menus);

      expect(menuTree).toHaveLength(1);
      expect(menuTree[0].code).toBe('system');
      expect(menuTree[0].children).toHaveLength(1);
      expect(menuTree[0].children[0].code).toBe('system_user');
    });
  });
});
