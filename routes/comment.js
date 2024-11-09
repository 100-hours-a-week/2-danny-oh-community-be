const express = require('express');
const router = express.Router();
const restController = require('../controllers/restController');

router.post('/:post_id/comments', restController.postComment_);
router.patch('/:post_id/comments/:comment_id', restController.patchComment_);
router.delete('/:post_id/comments/:comment_id', restController.deleteComment_);

module.exports = router;
