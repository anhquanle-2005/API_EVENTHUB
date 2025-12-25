// middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Import từ file config

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'avatars', // Thư mục lưu trên Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg'],
        // Đặt tên file theo UserId để dễ quản lý (tùy chọn)
        public_id: (req, file) => `avatar_${req.params.userId}_${Date.now()}`,
    },
});

const upload = multer({ storage: storage });

module.exports = upload;