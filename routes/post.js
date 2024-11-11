const express = require('express');
const router = express.Router();
const restController = require('../controllers/restController');
const authMiddleware = require('../middleware/authMiddleware');
const writerMiddleware = require('../middleware/writerMiddleware');

router.get('/', authMiddleware, restController.loadPosts);
router.post('/', authMiddleware, restController.createPost);
router.get('/:post_id', authMiddleware, restController.loadPostDetail);
router.patch('/:post_id', authMiddleware,  writerMiddleware, restController.updatePostDetail);
router.delete('/:post_id', authMiddleware, writerMiddleware, restController.deletePost);

module.exports = router;