// app.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');

// 업로드 디렉토리 생성
const uploadDir1 = path.join(__dirname, 'uploads/profileImages');
const uploadDir2 = path.join(__dirname, 'uploads/postImages');

if (!fs.existsSync(uploadDir1)) {
    fs.mkdirSync(uploadDir1, { recursive: true });
}

if (!fs.existsSync(uploadDir2)) {
    fs.mkdirSync(uploadDir2, { recursive: true });
}

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10 * 60 * 1000 }
}));



// 라우트 설정
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts', commentRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
