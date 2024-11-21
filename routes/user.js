import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUser, updateUserProfile, updateUserPass, deleteUser, logout } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

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
        const { user_id } = req.session.user;
        // user_id를 파일명으로 사용, 확장자는 파일 원본 그대로 유지
        cb(null, user_id + path.extname(file.originalname));
    }
});

// Multer 설정
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
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
    },
}).single('profileImage');

// 사용자 정보 조회
router.get('/', authMiddleware, getUser);

// 사용자 프로필 업데이트
router.patch('/', authMiddleware, (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            console.error('파일 업로드 에러:', err);
            return res.status(400).json({
                success: false,
                message: err.message || '파일 업로드 중 에러가 발생했습니다.',
            });
        }
        // 파일 업로드 성공 후 처리
        updateUserProfile(req, res, next);
    });
});

// 사용자 비밀번호 변경
router.patch('/password', authMiddleware, updateUserPass);

// 사용자 계정 삭제
router.delete('/', authMiddleware, deleteUser);

// 로그아웃
router.post('/logout', authMiddleware, logout);

export default router;
