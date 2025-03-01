const PerformanceController = require('./performance.controller');
const PerformanceService = require('../services/performance.service');

// 模拟 PerformanceService
jest.mock('../services/performance.service');

describe('PerformanceController', () => {
  let mockReq;
  let mockRes;
  
  // 在每个测试用例前重置请求和响应对象
  beforeEach(() => {
    mockReq = {
      body: {},
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
  });

  // 在每个测试用例后清除所有mock
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPerformance', () => {
    const mockPerformance = {
      name: '测试演出',
      date: '2024-03-20',
      venue: '测试场地'
    };

    it('应该成功创建演出并返回201状态码', async () => {
      mockReq.body = mockPerformance;
      PerformanceService.createPerformance.mockResolvedValue(mockPerformance);

      await PerformanceController.createPerformance(mockReq, mockRes);

      expect(PerformanceService.createPerformance).toHaveBeenCalledWith(mockPerformance);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockPerformance);
    });

    it('创建失败时应该返回400状态码', async () => {
      const error = new Error('创建失败');
      PerformanceService.createPerformance.mockRejectedValue(error);

      await PerformanceController.createPerformance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getAllPerformances', () => {
    const mockPerformances = [
      { id: 1, name: '演出1' },
      { id: 2, name: '演出2' }
    ];

    it('应该成功获取所有演出并返回200状态码', async () => {
      PerformanceService.getAllPerformances.mockResolvedValue(mockPerformances);

      await PerformanceController.getAllPerformances(mockReq, mockRes);

      expect(PerformanceService.getAllPerformances).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPerformances);
    });

    it('获取失败时应该返回500状态码', async () => {
      const error = new Error('获取失败');
      PerformanceService.getAllPerformances.mockRejectedValue(error);

      await PerformanceController.getAllPerformances(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getPerformanceById', () => {
    const mockPerformance = { id: '1', name: '测试演出' };

    it('应该成功获取单个演出并返回200状态码', async () => {
      mockReq.params.id = '1';
      PerformanceService.getPerformanceById.mockResolvedValue(mockPerformance);

      await PerformanceController.getPerformanceById(mockReq, mockRes);

      expect(PerformanceService.getPerformanceById).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPerformance);
    });

    it('获取不存在的演出时应该返回404状态码', async () => {
      mockReq.params.id = '999';
      PerformanceService.getPerformanceById.mockRejectedValue(new Error('演出未找到'));

      await PerformanceController.getPerformanceById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: '演出未找到' });
    });
  });

  describe('updatePerformance', () => {
    const mockPerformance = { id: '1', name: '更新后的演出' };

    it('应该成功更新演出并返回200状态码', async () => {
      mockReq.params.id = '1';
      mockReq.body = { name: '更新后的演出' };
      PerformanceService.updatePerformance.mockResolvedValue(mockPerformance);

      await PerformanceController.updatePerformance(mockReq, mockRes);

      expect(PerformanceService.updatePerformance).toHaveBeenCalledWith('1', mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockPerformance);
    });

    it('更新失败时应该返回400状态码', async () => {
      mockReq.params.id = '1';
      const error = new Error('更新失败');
      PerformanceService.updatePerformance.mockRejectedValue(error);

      await PerformanceController.updatePerformance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('deletePerformance', () => {
    it('应该成功删除演出并返回204状态码', async () => {
      mockReq.params.id = '1';
      PerformanceService.deletePerformance.mockResolvedValue({});

      await PerformanceController.deletePerformance(mockReq, mockRes);

      expect(PerformanceService.deletePerformance).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it('删除不存在的演出时应该返回404状态码', async () => {
      mockReq.params.id = '999';
      PerformanceService.deletePerformance.mockRejectedValue(new Error('演出未找到'));

      await PerformanceController.deletePerformance(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: '演出未找到' });
    });
  });
}); 