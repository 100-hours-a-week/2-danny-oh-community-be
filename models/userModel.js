import {db} from '../db.js';


// 사용자 데이터 로드 함수
async function loadUsersModel() {
    const sql = 'SELECT * FROM users WHERE is_delete = FALSE';
    const [rows] = await db.query(sql);
    return rows;
    
}

async function findUserByEmailModel(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.query(sql, [email]);
    return rows;
}

async function findUserByUserIdModel(user_id) {
    const sql = `SELECT * FROM users WHERE user_id = ?`
    const [rows] = await db.query(sql, [user_id]);
    return rows;
}

async function addUserModel(user) {
    const { email, password, nickname, profileImage } = user;
    const sql = `
        INSERT INTO user (email, password, nickname, image_url, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;
    const [result] = await db.query(sql, [email, password, nickname, profileImage]);
    return result.insertId;
}

// 사용자 프로필 업데이트 함수
async function updateProfileModel(user_id, nickname, profileImage, imageFlag) {
    let sql, params;

    if (imageFlag === 1) {
        sql = `
            UPDATE user 
            SET nickname = ?, image_url = ?, updated_at = NOW() 
            WHERE user_id = ? AND is_deleted = FALSE
        `;
        params = [nickname, profileImage, user_id];
    } else {
        sql = `
            UPDATE user 
            SET nickname = ?, updated_at = NOW() 
            WHERE user_id = ? AND is_deleted = FALSE
        `;
        params = [nickname, user_id];
    }

    await db.query(sql, params);
}

// 사용자 비밀번호 업데이트 함수
async function updatePasswordModel(user_id, newPassword){
    const sql = 'UPDATE users SET password = ? WHERE user_id = ?';
    await db.query(sql, [newPassword, user_id]);
}

async function deleteUserModel(user_id) {
    const sql = `
        UPDATE user 
        SET is_deleted = TRUE, updated_at = NOW() 
        WHERE user_id = ?
    `;
    await db.query(sql, [user_id]);
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
