const multer = require('multer');
const { storage } = require('../config/cloudinary');

const uploader = multer({ storage });

module.exports = uploader;
