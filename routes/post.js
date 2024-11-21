import express from 'express';
import { loadPosts, loadPostDetail, createPost, updatePostDetail, deletePost } from '../controllers/postController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import writerMiddleware from '../middleware/writerMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, loadPosts);
router.post('/', authMiddleware, createPost);
router.get('/:post_id', authMiddleware, loadPostDetail);
router.patch('/:post_id', authMiddleware, writerMiddleware, updatePostDetail);
router.delete('/:post_id', authMiddleware, writerMiddleware, deletePost);

export default router;
