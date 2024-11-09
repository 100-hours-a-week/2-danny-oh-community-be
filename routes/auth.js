const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('../controllers/authController');

// Multer 스토리지 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/profileImage');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // 클라이언트가 보낸 이메일을 파일명으로 사용
        const email = req.body.email.replace(/[^\w\s]/gi, '');  // 특수문자 제거
        // 이메일을 파일명으로 사용, 확장자는 파일 원본 그대로 유지
        cb(null, email + path.extname(file.originalname));
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

// 회원가입 라우트
router.post('/signup', (req, res, next) => {
    console.log(req.body);  // 이메일이 잘 넘어오는지 확인
    upload(req, res, function (err) {
        if (err) {
            console.error('파일 업로드 에러:', err);
            return res.status(400).json({
                success: false,
                message: err.message || '파일 업로드 중 에러가 발생했습니다.'
            });
        }
        
        // 파일 업로드 성공 후 회원가입 처리
        authController.signUp(req, res, next);
    });
});

router.post('/login', authController.login);
module.exports = router;
