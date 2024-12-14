import pool from '../db.js'; // db 연결

// 데이터베이스에서 댓글을 가져오는 함수
async function getCommentByIdModel(comment_id) {
    const sql = `
        SELECT c.user_id
        FROM comments c
        WHERE c.comment_id = ?
    `;

    let connection;
    try {
        connection = await pool.getConnection(); // 연결 객체 가져오기
        const [rows] = await connection.query(sql, [comment_id]); // 쿼리 실행
        if (rows.length === 0) {
            throw new Error('Comment not found');
        }
        return rows[0]; // 첫 번째 댓글 반환
    } catch (error) {
        console.error('Error fetching comment:', error);
        throw error;
    } finally {
        if (connection) connection.release(); // 연결 반환
    }
}

// 댓글 추가 함수
async function addCommentModel(post_id, newComment) {
    const sql = `INSERT INTO comments (post_id, user_id, contents, created_at) VALUES (?, ?, ?, NOW())`;
    const params = [post_id, newComment.user_id, newComment.content];

    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(sql, params);

        // 댓글 추가 후, 게시글의 댓글 수를 증가시킴
        const updateSql = `UPDATE posts SET comment_cnt = comment_cnt + 1 WHERE post_id = ?`;
        await connection.query(updateSql, [post_id]);

        return result; // 새로운 댓글 정보 반환
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    } finally {
        if (connection) connection.release(); // 연결 반환
    }
}

// 댓글 수정 함수
async function editCommentModel(comment_id, content) {
    const sql = `UPDATE comments SET contents = ?, updated_at = NOW() WHERE comment_id = ?`;
    const params = [content, comment_id];

    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(sql, params);
        return result.changedRows; // 수정된 댓글 반환
    } catch (error) {
        console.error('Error editing comment:', error);
        throw error;
    } finally {
        if (connection) connection.release(); // 연결 반환
    }
}

// 댓글 삭제 함수
async function deleteCommentModel(post_id, comment_id) {
    const sql = `UPDATE comments SET is_deleted = TRUE, updated_at = NOW() WHERE comment_id = ?`;
    const params = [comment_id];

    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(sql, params);

        if (result.affectedRows > 0) {
            // 댓글 삭제 후 게시글의 댓글 수 감소
            const updateSql = `UPDATE posts SET comment_cnt = comment_cnt - 1 WHERE post_id = ?`;
            await connection.query(updateSql, [post_id]);
            return 1;
        }

        return 0; // 삭제 실패 시
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    } finally {
        if (connection) connection.release(); // 연결 반환
    }
}

export {
    getCommentByIdModel,
    addCommentModel,
    editCommentModel,
    deleteCommentModel,
};
