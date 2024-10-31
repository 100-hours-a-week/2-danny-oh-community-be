const express = require('express');
const router = express.Router();
const restController = require('../controllers/restController');

router.post('/', restController.post_);
router.put('/', restController.put_);
router.patch('/', restController.patch_);
router.delete('/', restController.delete_);

module.exports = router;