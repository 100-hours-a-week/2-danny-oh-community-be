import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// 데이터베이스 연결 풀 설정
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    timezone: '+09:00', // 한국 시간대
    waitForConnections: true,
    connectionLimit: 10, // 연결 풀의 최대 연결 수
    queueLimit: 0,       // 대기열 제한 (0은 무제한)
    dateStrings: true
});

export default pool;
