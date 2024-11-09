// app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

const app = express();
const PORT = 3000;

require('dotenv').config();
require('./db'); // 데이터베이스 연결

app.use(express.json()); // JSON 데이터 처리
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 처리
app.use(cookieParser());
app.use(session({
    secret: 'mySecretKey', // 세션 암호화에 사용될 비밀키
    resave: false, // 세션 데이터가 변경된 경우만 세션 저장
    saveUninitialized: true, // 초기화되지 않은 빈 세션 저장할지?
    cookie: { 
        secure: false, // HTTPS 사용 시 true로 설정
        maxAge: 10 * 60 * 1000 // 세션 유효 시간 10분
    }
}));

// 인증 미들웨어
function authenticate(req, res, next) {
    if (req.session.user) {
        next(); // 인증된 경우 다음 미들웨어로 진행
    } else {
        res.status(400).json({ message: '인증이 필요합니다.' }); // 인증되지 않은 경우 400 반환
    }
}

// 인가 미들웨어
function authorize(req, res, next) {
    if (req.session.user.role === 'admin') {
        next(); // 인가된 경우 다음 미들웨어로 진행
    } else {
        res.status(400).json({ message: '어드민이 아닙니다' }); // 인가되지 않은 경우 400 반환
    }
}

// /users 경로에 대한 라우트 설정
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts', commentRoutes);

app.post('/login', (req, res) => {
    const { username, role } = req.body; // 클라이언트로부터 username과 role을 받음
    req.session.user = { username, role }; // 세션에 사용자 정보 저장
    res.json({ message: '세션 생성' });
});

// 인증이 필요한 라우트
app.get('/protected', authenticate, (req, res) => {
    res.json({ message: `Welcome, ${req.session.user.username}` });
});

// 인가가 필요한 라우트
app.get('/admin', authenticate, authorize, (req, res) => {
    res.json({ message: '어드민 유저입니다' });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
