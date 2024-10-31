// app.js
const express = require('express');
const restRoutes = require('./routes/rest');

const app = express();
const PORT = 3000;

app.use('/rest', restRoutes);

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
