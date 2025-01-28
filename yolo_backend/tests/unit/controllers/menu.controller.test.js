const MenuController = require('../../../src/controllers/menu.controller');
const MenuService = require('../../../src/services/menu.service');
const createError = require('http-errors');

jest.mock('../../../src/services/menu.service');

describe('MenuController', () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    controller = new MenuController();
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: {
        username: 'testUser'
      }
    };
    mockRes = {
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMenu', () => {
    const validMenuData = {
      title: '系统管理',
      code: 'system',
      path: '/system',
      icon: 'settings',
      parentCode: null,
      sort: 1
    };

    it('should create menu successfully', async () => {
      mockReq.body = validMenuData;
      const expectedMenu = { ...validMenuData, _id: 'testMenuId' };

      jest.spyOn(controller.menuService, 'createMenu')
        .mockResolvedValue(expectedMenu);

      await controller.createMenu(mockReq, mockRes, mockNext);

      expect(controller.menuService.createMenu).toHaveBeenCalledWith({
        ...validMenuData,
        createdBy: 'testUser',
        updatedBy: 'testUser'
      });
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: expectedMenu,
          msg: '菜单创建成功'
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle missing required fields', async () => {
      mockReq.body = { title: '系统管理' }; // Missing required fields

      await controller.createMenu(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 400,
          message: '标题、编码和路径为必填项'
        })
      );
    });
  });

  describe('updateMenu', () => {
    const updateData = {
      title: '更新的系统管理',
      path: '/system-new',
      icon: 'new-settings',
      sort: 2
    };

    it('should update menu successfully', async () => {
      mockReq.params = { code: 'system' };
      mockReq.body = updateData;
      const updatedMenu = {
        code: 'system',
        ...updateData
      };

      jest.spyOn(controller.menuService, 'updateMenu')
        .mockResolvedValue(updatedMenu);

      await controller.updateMenu(mockReq, mockRes, mockNext);

      expect(controller.menuService.updateMenu).toHaveBeenCalledWith(
        'system',
        {
          ...updateData,
          updatedBy: 'testUser'
        }
      );
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: updatedMenu,
          msg: '菜单更新成功'
        })
      );
    });

    it('should handle non-existent menu', async () => {
      mockReq.params = { code: 'nonexistent' };
      mockReq.body = updateData;

      jest.spyOn(controller.menuService, 'updateMenu')
        .mockResolvedValue(null);

      await controller.updateMenu(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 404,
          message: '菜单不存在'
        })
      );
    });
  });

  describe('deleteMenu', () => {
    it('should delete menu successfully', async () => {
      mockReq.params = { code: 'system' };

      jest.spyOn(controller.menuService, 'deleteMenu')
        .mockResolvedValue({ code: 'system' });

      await controller.deleteMenu(mockReq, mockRes, mockNext);

      expect(controller.menuService.deleteMenu).toHaveBeenCalledWith('system');
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          msg: '菜单删除成功'
        })
      );
    });

    it('should handle non-existent menu', async () => {
      mockReq.params = { code: 'nonexistent' };

      jest.spyOn(controller.menuService, 'deleteMenu')
        .mockResolvedValue(null);

      await controller.deleteMenu(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 404,
          message: '菜单不存在'
        })
      );
    });
  });

  describe('getMenuTree', () => {
    it('should get menu tree successfully', async () => {
      const mockMenuTree = [
        {
          code: 'system',
          title: '系统管理',
          children: [
            {
              code: 'user',
              title: '用户管理'
            }
          ]
        }
      ];

      jest.spyOn(controller.menuService, 'getMenuTree')
        .mockResolvedValue(mockMenuTree);

      await controller.getMenuTree(mockReq, mockRes, mockNext);

      expect(controller.menuService.getMenuTree).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockMenuTree
        })
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to get menu tree');
      jest.spyOn(controller.menuService, 'getMenuTree')
        .mockRejectedValue(error);

      await controller.getMenuTree(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllMenus', () => {
    it('should get all menus successfully', async () => {
      const mockMenus = [
        { code: 'system', title: '系统管理' },
        { code: 'user', title: '用户管理' }
      ];

      jest.spyOn(controller.menuService, 'getAllMenus')
        .mockResolvedValue(mockMenus);

      await controller.getAllMenus(mockReq, mockRes, mockNext);

      expect(controller.menuService.getAllMenus).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: mockMenus
        })
      );
    });

    it('should handle errors', async () => {
      const error = new Error('Failed to get menus');
      jest.spyOn(controller.menuService, 'getAllMenus')
        .mockRejectedValue(error);

      await controller.getAllMenus(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
