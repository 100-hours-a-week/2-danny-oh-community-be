import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadPosts, loadPostDetail, createPost, updatePostDetail, deletePost } from '../controllers/postController.js';
import { generatePostIdModel } from '../models/postModel.js';
import authMiddleware from '../middleware/authMiddleware.js';
import writerMiddleware from '../middleware/writerMiddleware.js';

// __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer 스토리지 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/postImages');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const new_post_id = generatePostIdModel();
        cb(null, new_post_id + path.extname(file.originalname));
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
}).single('postImage');

// 게시물 전체 조회
router.get('/', authMiddleware, loadPosts);

// 게시물 생성
router.post('/', authMiddleware, (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            console.error('파일 업로드 에러:', err);
            return res.status(400).json({
                success: false,
                message: err.message || '파일 업로드 중 에러가 발생했습니다.',
            });
        }
        // 파일 업로드 성공 후 처리
        createPost(req, res, next);
    });
});

// 게시물 상세 조회
router.get('/:post_id', authMiddleware, loadPostDetail);

// 게시물 수정
router.patch('/:post_id', authMiddleware, writerMiddleware, (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            console.error('파일 업로드 에러:', err);
            return res.status(400).json({
                success: false,
                message: err.message || '파일 업로드 중 에러가 발생했습니다.',
            });
        }
        // 파일 업로드 성공 후 처리
        updatePostDetail(req, res, next);
    });
});

// 게시물 삭제
router.delete('/:post_id', authMiddleware, writerMiddleware, deletePost);

export default router;
