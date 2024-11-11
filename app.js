// app.js
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fs = require('fs');

// 업로드 디렉토리 생성
const uploadDir = path.join(__dirname, 'uploads/profileImage');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
// const commentRoutes = require('./routes/comment');

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
// app.use('/post', postRoutes);
// app.use('/post', commentRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
