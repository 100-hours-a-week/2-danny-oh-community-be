// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();
const PORT = 3000;

app.get('/text', (req, res) => {
    res.send('Hello, world!'); // 문자열 응답
  });
  
app.get('/json', (req, res) => {
    res.json({ message: 'Hello, world!' }); // JSON 응답
});

app.get('/end', (req, res) => {
    res.status(200);
    res.end(); // 응답 종료
});

app.post('/', (req, res) => {
    const {value} = req.body;
    res.send(`받은 인자: ${value}`);
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
