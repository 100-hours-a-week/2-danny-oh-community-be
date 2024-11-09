// routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/', userController.getUsers);
router.patch('/', userController.updateUserProfile);
router.patch('/password', userController.updateUserPass);
router.delete('/', userController.deleteUser);


module.exports = router;