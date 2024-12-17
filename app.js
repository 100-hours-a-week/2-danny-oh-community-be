import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import commentRoutes from './routes/comment.js';
import dotenv from 'dotenv';

dotenv.config();

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
const allowedOrigins = [
    `http://13.209.17.149`, // 환경 변수로 설정된 도메인
    `http://${process.env.STORAGE_SERVER}`,      // 추가 도메인
];

app.use(
    cors({
        origin: (origin, callback) => {
            // 요청한 origin이 허용된 도메인에 포함되거나, origin이 없을 때(예: CORS 미사용 요청)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // 쿠키 허용
    })
);


app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts', commentRoutes);

// 현재 접속자 목록 출력
app.get('/active-users', (req, res) => {
    const sessionStore = req.sessionStore;

    sessionStore.all((err, sessions) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve sessions' });
        }

        // 세션 데이터에서 user 정보가 있는 경우 닉네임과 프로필 이미지 주소만 추출
        const activeUsers = Object.values(sessions)
            .filter((session) => session.user) // user 데이터가 있는 세션만 필터링
            .map((session) => ({
                nickname: session.user.nickname,
                profileImage: session.user.profileImage,
            }));

        res.json(activeUsers); // 필터링된 결과를 JSON 형태로 반환
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://${process.env.ADDRESS}:${PORT}`);
});