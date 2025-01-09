const multer = require('multer');
const path = require('path');
const createError = require('http-errors');

// 配置存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');  // 使用已存在的public/uploads目录
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 只允许图片
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new createError(400, '只允许上传图片文件！'), false);
  }
  cb(null, true);
};

// 配置multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 最大文件大小
  },
  fileFilter: fileFilter
});

module.exports = upload;
