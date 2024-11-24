import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import fs from 'fs';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import commentRoutes from './routes/comment.js';

// __dirname 설정 (ES 모듈 환경에서 __dirname 사용)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 업로드 디렉토리 생성
const uploadDir1 = path.join(__dirname, 'uploads/profileImages');
const uploadDir2 = path.join(__dirname, 'uploads/postImages');

if (!fs.existsSync(uploadDir1)) {
    fs.mkdirSync(uploadDir1, { recursive: true });
}

if (!fs.existsSync(uploadDir2)) {
    fs.mkdirSync(uploadDir2, { recursive: true });
}

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: 'mySecretKey',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, // 로컬 환경에서는 false로 설정
            httpOnly: true, // 자바스크립트로 쿠키를 접근할 수 없도록 설정
            maxAge: 60 * 60 * 1000, // 쿠키 만료 시간 설정
        },
    })
);

// cors 설정
app.use(
    cors({
        origin: 'http://localhost:3000', // 클라이언트 도메인
        credentials: true, // 쿠키를 포함한 요청 허용
    })
);

// 업로드된 이미지 제공 API
const uploadDir = path.join(__dirname, 'uploads');

// 라우트 설정
app.use('/uploads', express.static(uploadDir));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts', commentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});