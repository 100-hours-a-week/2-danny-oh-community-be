import express from 'express';
import { createComment, updateComment, deleteComment } from '../controllers/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import commentWriterMiddleware from '../middleware/commentWriterMiddleware.js';

const router = express.Router();

router.post('/:post_id/comments', authMiddleware, createComment);
router.patch('/:post_id/comments/:comment_id', authMiddleware, commentWriterMiddleware, updateComment);
router.delete('/:post_id/comments/:comment_id', authMiddleware, commentWriterMiddleware, deleteComment);

export default router;
