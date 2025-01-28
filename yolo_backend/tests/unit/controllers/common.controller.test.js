const commonController = require('../../../src/controllers/common.controller');
const uploadUtil = require('../../../src/utils/upload.util');
const ApiResponse = require('../../../src/utils/response');

jest.mock('../../../src/utils/upload.util');

describe('CommonController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      files: [],
      protocol: 'http',
      get: jest.fn().mockReturnValue('localhost:3000')
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadImages', () => {
    it('should upload images successfully', async () => {
      const mockFiles = [
        { 
          path: '/uploads/image1.jpg',
          filename: 'image1.jpg'
        },
        {
          path: '/uploads/image2.jpg',
          filename: 'image2.jpg'
        }
      ];
      mockReq.files = mockFiles;

      uploadUtil.getFileUrl.mockImplementation(path => path);

      await commonController.uploadImages(mockReq, mockRes);

      expect(uploadUtil.getFileUrl).toHaveBeenCalledTimes(2);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000000',
          data: {
            urls: [
              {
                url: 'http://localhost:3000/uploads/image1.jpg',
                filename: 'image1.jpg'
              },
              {
                url: 'http://localhost:3000/uploads/image2.jpg',
                filename: 'image2.jpg'
              }
            ]
          }
        })
      );
    });

    it('should return 400 when no files are uploaded', async () => {
      mockReq.files = [];

      await commonController.uploadImages(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000001',
          msg: 'No files uploaded'
        })
      );
    });

    it('should handle errors during upload', async () => {
      const mockFiles = [{ path: '/uploads/image1.jpg', filename: 'image1.jpg' }];
      mockReq.files = mockFiles;

      const error = new Error('Upload failed');
      uploadUtil.getFileUrl.mockImplementation(() => {
        throw error;
      });

      await commonController.uploadImages(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          code: '000001',
          msg: expect.stringContaining('Failed to upload files')
        })
      );
    });
  });
});
