// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/',authMiddleware, userController.getUser);
router.patch('/',authMiddleware, userController.updateUserProfile);
router.patch('/password',authMiddleware, userController.updateUserPass);
router.delete('/',authMiddleware, userController.deleteUser);


module.exports = router;