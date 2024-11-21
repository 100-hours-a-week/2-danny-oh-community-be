import mysql from 'mysql2/promise'; // Promise 기반 사용
import dotenv from 'dotenv';

dotenv.config();

const createTablesSQL = `
CREATE TABLE IF NOT EXISTS user (
    user_id INT NOT NULL AUTO_INCREMENT COMMENT '회원 ID',
    email VARCHAR(100) NOT NULL COMMENT '이메일',
    password VARCHAR(255) NOT NULL COMMENT '비밀번호',
    image_url TEXT NULL COMMENT '프로필 이미지',
    nickname VARCHAR(100) NOT NULL COMMENT '닉네임',
    created_at DATETIME NOT NULL COMMENT '회원 생성일',
    updated_at DATETIME NULL COMMENT '회원 수정일',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '삭제 여부',
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS posts (
    post_id INT NOT NULL AUTO_INCREMENT COMMENT '게시글 ID',
    user_fk INT NOT NULL COMMENT '회원 참조 키',
    title VARCHAR(100) NOT NULL COMMENT '글 제목',
    contents TEXT NOT NULL COMMENT '글 내용',
    photo_url TEXT NULL COMMENT '사진 URL',
    view_cnt INT NOT NULL DEFAULT 0 COMMENT '조회수',
    like_cnt INT NOT NULL DEFAULT 0 COMMENT '좋아요수',
    comment_cnt INT NOT NULL DEFAULT 0 COMMENT '댓글수',
    created_at DATETIME NOT NULL COMMENT '게시글 작성일',
    updated_at DATETIME NULL COMMENT '게시글 수정일',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '삭제 여부',
    PRIMARY KEY (post_id),
    FOREIGN KEY (user_fk) REFERENCES user(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id INT NOT NULL AUTO_INCREMENT COMMENT '댓글 ID',
    user_fk INT NOT NULL COMMENT '회원 참조 키',
    post_fk INT NOT NULL COMMENT '게시글 참조 키',
    contents TEXT NOT NULL COMMENT '댓글 내용',
    created_at DATETIME NOT NULL COMMENT '댓글 작성일',
    updated_at DATETIME NULL COMMENT '댓글 수정일',
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE COMMENT '삭제 여부',
    PRIMARY KEY (comment_id),
    FOREIGN KEY (user_fk) REFERENCES user(user_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (post_fk) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);
`;

// 데이터베이스 초기화 함수
const initializeDatabase = async (connection) => {
    try {
        console.log('Initializing database...');
        await connection.query(createTablesSQL);
        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Error during database initialization:', err);
        throw err;
    }
};

// 데이터베이스 연결 함수
const db = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });
        console.log('Connected to the database.');
        return connection;
    } catch (err) {
        console.error('DB connection failed:', err);
        throw err;
    }
};

export { db, initializeDatabase };
