import express from 'express';
import multer from 'multer'; // Multer를 import해야 함
import { signUp, login } from '../controllers/authController.js';
import { uploadProfileImage } from '../utils/uploadProfileUtils.js';

// Multer 메모리 저장소 설정
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/signup', upload.single('file'), signUp);
router.post('/login', login);

export default router;
