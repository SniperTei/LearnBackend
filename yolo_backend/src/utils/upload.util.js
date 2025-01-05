const multer = require('multer');
const path = require('path');
const fs = require('fs');

class UploadUtil {
  constructor() {
    // 创建上传目录
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    this.createUploadDir();

    // 配置存储
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        
        // 按日期创建子目录
        const dateDir = path.join(this.uploadDir, String(year), month, day);
        fs.mkdirSync(dateDir, { recursive: true });
        cb(null, dateDir);
      },
      filename: (req, file, cb) => {
        // 生成文件名：时间戳-随机数.扩展名
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
      }
    });

    // 文件类型过滤器
    this.fileFilter = {
      image: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only images are allowed.'), false);
        }
      },
      // 可以在这里添加其他类型的过滤器，如视频、音频等
      video: (req, file, cb) => {
        const allowedMimes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only videos are allowed.'), false);
        }
      },
      audio: (req, file, cb) => {
        const allowedMimes = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only audio files are allowed.'), false);
        }
      }
    };
  }

  // 创建上传目录
  createUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // 获取文件URL
  getFileUrl(filePath) {
    // 移除process.cwd()和public部分，转换为URL路径
    const relativePath = filePath.replace(path.join(process.cwd(), 'public'), '');
    // 返回可访问的URL
    return `/uploads${relativePath.split('uploads')[1]}`;
  }

  // 创建上传中间件
  createUploader(type, maxCount = 9) {
    return multer({
      storage: this.storage,
      fileFilter: this.fileFilter[type],
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: maxCount
      }
    });
  }
}

module.exports = new UploadUtil();
