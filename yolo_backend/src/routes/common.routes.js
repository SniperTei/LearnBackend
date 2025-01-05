const express = require('express');
const router = express.Router();
const commonController = require('../controllers/common.controller');
const uploadUtil = require('../utils/upload.util');
const auth = require('../middleware/auth');

// 上传图片，最多9张
router.post('/uploadImg', 
  auth,
  uploadUtil.createUploader('image', 9).array('files', 9),
  commonController.uploadImages
);

module.exports = router;
