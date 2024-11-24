import mysql from 'mysql2/promise'; // Promise 기반 사용
import dotenv from 'dotenv';

dotenv.config();

// 데이터베이스 연결 함수

const db = async () => {
    try {
        // 데이터베이스 연결 설정
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        console.log('Connected to the database.');
        return connection;  // 연결 객체 반환
    } catch (err) {
        console.error('DB connection failed:', err);
        throw err;  // 오류 던지기
    }
};

export default db;
