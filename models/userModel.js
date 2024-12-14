import pool from '../db.js'; // 연결 풀 가져오기

// 사용자 데이터 로드 함수 (로그인)
async function loadUsersModel(email, password) {
    const sql = `
        SELECT * 
        FROM users 
        WHERE email = ? AND password = ? AND is_deleted = FALSE
    `;

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [email, password]);
        return rows[0] || null; // 사용자가 없으면 null 반환
    } catch (error) {
        console.error('Error loading user:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// 이메일로 사용자 찾기
async function findUserByEmailModel(email) {
    const sql = `
        SELECT * 
        FROM users 
        WHERE email = ? AND is_deleted = FALSE
    `;

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [email]);
        return rows.length > 0; // 사용자가 있으면 true 반환
    } catch (error) {
        console.error('Error finding user by email:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// 닉네임으로 사용자 찾기
async function findUserByNicknameModel(nickname) {
    const sql = `
        SELECT * 
        FROM users 
        WHERE nickname = ? AND is_deleted = FALSE
    `;

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [nickname]);
        return rows.length > 0; // 사용자가 있으면 true 반환
    } catch (error) {
        console.error('Error finding user by nickname:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// 사용자 ID로 사용자 정보 가져오기
async function findUserByUserIdModel(user_id) {
    const sql = `
        SELECT * 
        FROM users 
        WHERE user_id = ? AND is_deleted = FALSE
    `;

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [user_id]);
        return rows[0] || null; // 사용자가 없으면 null 반환
    } catch (error) {
        console.error('Error finding user by user ID:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// 사용자 추가 (회원가입)
async function addUserModel(user) {
    const { email, password, nickname, profileImage } = user;
    const sql = `
        INSERT INTO users (email, password, nickname, image_url, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;

    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(sql, [email, password, nickname, profileImage]);
        return result.insertId; // 생성된 사용자 ID 반환
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
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

    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(sql, params);
        return result.affectedRows > 0; // 업데이트 성공 여부 반환
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// 사용자 비밀번호 업데이트 함수
async function updatePasswordModel(user_id, newPassword) {
    const sql = `
        UPDATE users 
        SET password = ?, updated_at = NOW() 
        WHERE user_id = ? AND is_deleted = FALSE
    `;

    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(sql, [newPassword, user_id]);
        return result.affectedRows > 0; // 업데이트 성공 여부 반환
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// 사용자 삭제 함수 (논리 삭제)
async function deleteUserModel(user_id) {
    const sql = `
        UPDATE users 
        SET is_deleted = TRUE, updated_at = NOW() 
        WHERE user_id = ?
    `;

    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(sql, [user_id]);
        return result.affectedRows > 0; // 삭제 성공 여부 반환
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export {
    loadUsersModel,
    findUserByUserIdModel,
    addUserModel,
    updateProfileModel,
    updatePasswordModel,
    deleteUserModel,
    findUserByEmailModel,
    findUserByNicknameModel
};
