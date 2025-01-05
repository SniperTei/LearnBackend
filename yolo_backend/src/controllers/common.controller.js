const ApiResponse = require('../utils/response');
const uploadUtil = require('../utils/upload.util');

/**
 * 上传图片
 * POST /api/v1/common/uploadImg
 */
exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json(ApiResponse.error('No files uploaded', 400));
    }

    // 获取主机信息
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;

    // 处理文件URL
    const urls = req.files.map(file => {
      const relativePath = uploadUtil.getFileUrl(file.path);
      return {
        url: `${baseUrl}${relativePath}`,
        filename: file.filename
      };
    });

    res.json(ApiResponse.success({
      urls: urls
    }));
  } catch (error) {
    res.status(500).json(ApiResponse.error('Failed to upload files: ' + error.message, 500));
  }
};
