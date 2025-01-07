import express from 'express';
import { loadPosts, loadPostDetail, createPost, updatePostDetail, deletePost, likePost, viewCntPost } from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import writerMiddleware from '../middleware/writerMiddleware.js';
import upload from '../utils/uploadPostUtils.js';

const router = express.Router();

router.get('/', authMiddleware, loadPosts);
router.post('/', authMiddleware, upload.single('file'), createPost);
router.get('/:post_id', authMiddleware, loadPostDetail);
router.patch('/:post_id', authMiddleware, writerMiddleware, upload.single('file'), updatePostDetail);
router.delete('/:post_id', authMiddleware, writerMiddleware, deletePost);
router.post('/:post_id/like', authMiddleware, likePost);
router.post('/:post_id', authMiddleware, viewCntPost);

export default router;
