import express from 'express';
import multer from 'multer';
import { signUp, login } from '../controllers/authController.js';
// import { uploadProfileImage } from '../utils/uploadProfileUtils.js';

// Multer 메모리 저장소 설정
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});


const router = express.Router();

router.post('/signup', upload.single('file'), signUp);
router.post('/login', login);

export default router;
