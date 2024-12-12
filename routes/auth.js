import express from 'express';
import { signUp, login } from '../controllers/authController.js';
import upload from '../utils/uploadProfileUtils.js';


const router = express.Router();

router.post('/signup', upload.single('file'), signUp);
router.post('/login', login);

export default router;
