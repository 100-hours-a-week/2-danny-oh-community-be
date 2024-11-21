import express from 'express';
import { createComment, updateComment, deleteComment } from '../controllers/commentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import commentWriterMiddleware from '../middleware/commentWriterMiddleware.js';

const router = express.Router();

// 댓글 생성
router.post('/:post_id/comments', authMiddleware, createComment);

// 댓글 수정
router.patch('/:post_id/comments/:comment_id', authMiddleware, commentWriterMiddleware, updateComment);

// 댓글 삭제
router.delete('/:post_id/comments/:comment_id', authMiddleware, commentWriterMiddleware, deleteComment);

export default router;
