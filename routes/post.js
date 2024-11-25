import express from 'express';
import { loadPosts, loadPostDetail, createPost, updatePostDetail, deletePost, likePost } from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import writerMiddleware from '../middleware/writerMiddleware.js';
import { uploadPostImage } from '../utils/uploadPostUtils.js';

const router = express.Router();

router.get('/', authMiddleware, loadPosts);
router.post('/', authMiddleware, uploadPostImage, createPost);
router.get('/:post_id', authMiddleware, loadPostDetail);
router.patch('/:post_id', authMiddleware, writerMiddleware, uploadPostImage, updatePostDetail);
router.delete('/:post_id', authMiddleware, writerMiddleware, deletePost);
router.post('/:post_id/like', authMiddleware, likePost);

export default router;
