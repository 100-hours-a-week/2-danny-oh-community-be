import db from '../db.js'; // db 연결
const connectDB = await db();  // db()를 호출하여 연결 객체를 가져옴

// 데이터베이스에서 댓글을 가져오는 함수
async function getCommentByIdModel(comment_id) {
    const sql = `
        SELECT c.user_id
        FROM comments c
        WHERE c.comment_id = ?
    `;
    
    try {
        const [rows] = await connectDB.query(sql, [comment_id]);  // db.query는 비동기 함수
        if (rows.length === 0) {
            throw new Error('Comment not found');
        }
        return rows[0];  // 첫 번째 댓글 반환
    } catch (error) {
        console.error('Error fetching comment:', error);
        throw error;
    }
}


// 댓글 추가 함수
async function addCommentModel(post_id, newComment) {
    const sql = `INSERT INTO comments (post_id, user_id, contents, created_at) VALUES (?, ?, ?, NOW())`;
    const params = [post_id, newComment.user_id, newComment.content];
    
    const [result] = await connectDB.query(sql, params);

    // 댓글이 추가된 후, 해당 게시글의 댓글 수를 증가시킴
    const updateSql = `UPDATE posts SET comment_cnt = comment_cnt + 1 WHERE post_id = ?`;
    await connectDB.query(updateSql, [post_id]);

    return result; // 새로운 댓글 정보 반환
}

// 댓글 수정 함수
async function editCommentModel(comment_id, content){
    const sql = `UPDATE comments SET contents = ?, updated_at = NOW() WHERE comment_id = ?`;
    const params = [content, comment_id];
    
    const [result] = await connectDB.query(sql, params);

    return result.changedRows; // 수정된 댓글 반환
}

// 댓글 삭제 함수
async function deleteCommentModel(post_id, comment_id){
    const sql = `UPDATE comments SET is_deleted = TRUE, updated_at = Now() WHERE comment_id = ?`;
    const params = [comment_id];
    
    const [result] = await connectDB.query(sql, params);

    if (result.affectedRows > 0) {
        // 댓글 삭제 후 게시글의 댓글 수 감소
        const updateSql = `UPDATE posts SET comment_cnt = comment_cnt - 1 WHERE post_id = ?`;
        await connectDB.query(updateSql, [post_id]);
        return 1;
    }

    return 0; // 삭제 실패 시
}


export {
    getCommentByIdModel,
    addCommentModel,
    editCommentModel,
    deleteCommentModel
};