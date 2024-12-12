import express from 'express';
import { loadPosts, loadPostDetail, createPost, updatePostDetail, deletePost, likePost, viewcntPost } from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import writerMiddleware from '../middleware/writerMiddleware.js';
import upload from '../utils/uploadPostUtils.js';

const router = express.Router();

router.get('/', loadPosts);
router.post('/', authMiddleware, upload.single('file'), createPost);
router.get('/:post_id', loadPostDetail);
router.patch('/:post_id', authMiddleware, writerMiddleware, upload.single('file'), updatePostDetail);
router.delete('/:post_id', authMiddleware, writerMiddleware, deletePost);
router.post('/:post_id/like', authMiddleware, likePost);
router.post('/:post_id', authMiddleware, viewcntPost);

export default router;
