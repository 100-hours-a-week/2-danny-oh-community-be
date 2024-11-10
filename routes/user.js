// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/profileImage');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const { email } = req.session.user; 
        // 이메일을 파일명으로 사용, 확장자는 파일 원본 그대로 유지
        cb(null, email.replace(/[^\w\s]/gi, '') + path.extname(file.originalname));
    }
});

// Multer 설정
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: function (req, file, cb) {
        // 이미지 파일 필터링
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
}).single('profileImage');

router.get('/',authMiddleware, userController.getUser);
router.patch('/',authMiddleware, (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            console.error('파일 업로드 에러:', err);
            return res.status(400).json({
                success: false,
                message: err.message || '파일 업로드 중 에러가 발생했습니다.'
            });
        }
        
        // 파일 업로드 성공 후 회원가입 처리
        userController.updateUserProfile(req, res, next);
    });
});
router.patch('/password',authMiddleware, userController.updateUserPass);
router.delete('/',authMiddleware, userController.deleteUser);
router.post('/logout', authMiddleware, userController.logout);


module.exports = router;