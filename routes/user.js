import express from 'express';
import multer from 'multer';
import { getUser, updateUserProfile, updateUserPass, deleteUser, logout } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { uploadProfileImage } from '../utils/uploadProfileUtils.js';

// Multer 메모리 저장소 설정
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const router = express.Router();

router.get('/', authMiddleware, getUser);
router.patch('/', authMiddleware, upload.single('file'), updateUserProfile);
router.patch('/password', authMiddleware, updateUserPass);
router.delete('/', authMiddleware, deleteUser);
router.post('/logout', authMiddleware, logout);

export default router;
