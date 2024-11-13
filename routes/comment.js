const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');
const commentWriterMiddleware = require('../middleware/commentWriterMiddleware')

router.post('/:post_id/comments', authMiddleware, commentController.createComment);
router.patch('/:post_id/comments/:comment_id', authMiddleware, commentWriterMiddleware, commentController.updateComment);
router.delete('/:post_id/comments/:comment_id', authMiddleware, commentWriterMiddleware, commentController.deleteComment);

module.exports = router;
