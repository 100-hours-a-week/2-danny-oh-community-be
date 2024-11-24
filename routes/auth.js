import express from 'express';
import { signUp, login } from '../controllers/authController.js';
import { uploadProfileImage } from '../utils/uploadProfileUtils.js';

const router = express.Router();

router.post('/signup', uploadProfileImage, signUp);
router.post('/login', login);

export default router;
