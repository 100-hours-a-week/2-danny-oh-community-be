// app.js
const express = require('express');
const userRoutes = require('./routes/users');
const restRoutes = require('./routes/rest');

const app = express();
const PORT = 3000;

require('dotenv').config();
require('./db'); // 데이터베이스 연결

app.use(express.json()); // JSON 데이터 처리
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 처리

// /users 경로에 대한 라우트 설정
app.use('/users', userRoutes);
app.use('/rest', restRoutes);


// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
