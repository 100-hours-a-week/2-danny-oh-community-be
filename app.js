// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();
const PORT = 3000;

app.post('/post', (req, res) => {
    return res.status(201).json({
          status: 201,
          message: 'POST',
          data: req.body
    });
});

app.put('/put', (req, res) => {
    return res.status(200).json({
          status: 200,
          message: 'PUT',
          data: req.body
    });
});

app.patch('/patch', (req, res) => {
    return res.status(200).json({
          status: 200,
          message: 'PATCH',
          data: req.body
    });
});

app.delete('/delete', (req, res) => {
    return res.status(204).json({
          status: 204,
          message: 'DELETE',
          data: null
    });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
