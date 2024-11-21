import express from 'express';
import { getUser, updateUserProfile, updateUserPass, deleteUser, logout } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadProfileImage } from '../utils/uploadProfileUtils.js';
const router = express.Router();

router.get('/', authMiddleware, getUser);
router.patch('/', authMiddleware, uploadProfileImage, updateUserProfile);
router.patch('/password', authMiddleware, updateUserPass);
router.delete('/', authMiddleware, deleteUser);
router.post('/logout', authMiddleware, logout);

export default router;
