import db from '../db.js';


const connectDB = await db();  // db()를 호출하여 연결 객체를 가져옴
// 사용자 데이터 로드 함수
async function loadUsersModel(email, password) {
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ? AND is_deleted = FALSE';
    const [rows] = await connectDB.query(sql, [email, password]);
    return rows[0] ? rows[0] : 0;
}


async function findUserByEmailModel(email) {
    const sql = 'SELECT * FROM users WHERE email = ? AND is_deleted = FALSE';
    const [rows] = await connectDB.query(sql, [email]);
    return rows.length;
}

async function findUserByUserIdModel(user_id) {
    const sql = `SELECT * FROM users WHERE user_id = ?`
    const [rows] = await connectDB.query(sql, [user_id]);
    return rows[0];
}

async function addUserModel(user) {
    const { email, password, nickname, profileImage } = user;
    const sql = `
        INSERT INTO users (email, password, nickname, image_url, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;
    const [result] = await connectDB.query(sql, [email, password, nickname, profileImage]);
    return result.insertId;
}

// 사용자 프로필 업데이트 함수
async function updateProfileModel(user_id, nickname, profileImage, imageFlag) {
    let sql, params;

    if (imageFlag === 1) {
        sql = `
            UPDATE users 
            SET nickname = ?, image_url = ?, updated_at = NOW() 
            WHERE user_id = ? AND is_deleted = FALSE
        `;
        params = [nickname, profileImage, user_id];
    } else {
        sql = `
            UPDATE users 
            SET nickname = ?, updated_at = NOW() 
            WHERE user_id = ? AND is_deleted = FALSE
        `;
        params = [nickname, user_id];
    }

    await connectDB.query(sql, params);
}

// 사용자 비밀번호 업데이트 함수
async function updatePasswordModel(user_id, newPassword){
    const sql = 'UPDATE users SET password = ?, updated_at = NOW() WHERE user_id = ?';
    await connectDB.query(sql, [newPassword, user_id]);
}

async function deleteUserModel(user_id) {
    const sql = `
        UPDATE users 
        SET is_deleted = TRUE, updated_at = NOW() 
        WHERE user_id = ?
    `;
    await connectDB.query(sql, [user_id]);
}

export {
    loadUsersModel,
    findUserByUserIdModel,
    addUserModel,
    updateProfileModel,
    updatePasswordModel,
    deleteUserModel,
    findUserByEmailModel
};
