import express from 'express';
import { getUser, updateUserProfile, updateUserPass, deleteUser, logout } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../utils/uploadProfileUtils.js';

const router = express.Router();

router.get('/', authMiddleware, getUser);
router.patch('/', authMiddleware, upload.single('file'), updateUserProfile);
router.patch('/password', authMiddleware, updateUserPass);
router.delete('/', authMiddleware, deleteUser);
router.post('/logout', authMiddleware, logout);

export default router;
