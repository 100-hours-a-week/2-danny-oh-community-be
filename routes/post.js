const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const postModel = require('../models/postModel');
const authMiddleware = require('../middleware/authMiddleware');
const writerMiddleware = require('../middleware/writerMiddleware');

const multer = require('multer');
const path = require('path');

// Multer 스토리지 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/postImages');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const new_post_id = postModel.generatePostId();
        cb(null, new_post_id + path.extname(file.originalname));
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
}).single('postImage');

router.get('/', authMiddleware, postController.loadPosts);

router.post('/', authMiddleware, (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            console.error('파일 업로드 에러:', err);
            return res.status(400).json({
                success: false,
                message: err.message || '파일 업로드 중 에러가 발생했습니다.'
            });
        }
        // 파일 업로드 성공 후 업로드 처리
        postController.createPost(req, res, next);
    });
});

router.get('/:post_id', authMiddleware, postController.loadPostDetail);
router.patch('/:post_id', authMiddleware,  writerMiddleware, (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            console.error('파일 업로드 에러:', err);
            return res.status(400).json({
                success: false,
                message: err.message || '파일 업로드 중 에러가 발생했습니다.'
            });
        }
        
        // 파일 업로드 성공 후 업로드 처리
        postController.updatePostDetail(req, res, next);
    });
});
router.delete('/:post_id', authMiddleware, writerMiddleware, postController.deletePost);

module.exports = router;