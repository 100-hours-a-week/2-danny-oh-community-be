import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { signUp, login } from '../controllers/authController.js';
import { generateUserIdModel } from '../models/userModel.js';

// __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer 스토리지 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/profileImages');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const new_id = generateUserIdModel();
        // user_id를 파일명으로 사용, 확장자는 파일 원본 그대로 유지
        cb(null, new_id + path.extname(file.originalname));
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
    console.log(req.body); // 이메일이 잘 넘어오는지 확인
    upload(req, res, function (err) {
        if (err) {
            console.error('파일 업로드 에러:', err);
            return res.status(400).json({
                success: false,
                message: err.message || '파일 업로드 중 에러가 발생했습니다.'
            });
        }
        // 파일 업로드 성공 후 회원가입 처리
        signUp(req, res, next);
    });
});

router.post('/login', login);

export default router;
