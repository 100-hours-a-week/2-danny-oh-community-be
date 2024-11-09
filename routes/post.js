const express = require('express');
const router = express.Router();
const restController = require('../controllers/restController');

router.post('/', restController.post_);
router.put('/', restController.put_);
router.get('/', restController.get_);
router.get('/:post_id', restController.getDetail_);
router.patch('/:post_id', restController.patch_);
router.delete('/:post_id', restController.delete_);

module.exports = router;