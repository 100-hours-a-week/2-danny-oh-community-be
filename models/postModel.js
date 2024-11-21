import db from '../db.js'; // db 연결

const connectDB = await db();  // db()를 호출하여 연결 객체를 가져옴
// 게시글 전체 조회 함수
async function getAllPostsModel() {
    const sql = `
        SELECT p.*, u.nickname, u.email, u.image_url 
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        WHERE p.is_deleted = FALSE
        ORDER BY p.created_at DESC
    `;
    const [rows] = await connectDB.query(sql);
    return rows;
}

// 게시글 생성 함수
async function createPostModel(newPost) {
    const { title, content, postImage, user_id } = newPost;
    const sql = `
        INSERT INTO posts (title, contents, photo_url, user_id, created_at) 
        VALUES (?, ?, ?, ?, NOW())
    `;
    await connectDB.query(sql, [title, content, postImage, user_id]);
}

async function getPostAuth(postId){
    const sql = `SELECT user_id FROM posts WHERE post_id = ?`;
    const [post] = await connectDB.query(sql, [postId]);
    return post[0];
}

// 특정 게시글 조회 함수
async function getPostByIdModel(postId) {
    const sql = `
        SELECT p.*, u.nickname AS author_nickname, u.image_url AS author_image_url
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        WHERE p.post_id = ? AND p.is_deleted = FALSE
    `;
    const [post] = await connectDB.query(sql, [postId]);

    if (post.length === 0) {
        return null;  // 게시글이 존재하지 않으면 null 반환
    }
    console.log(post);
    // 댓글 정보 조회
    const commentSql = `
        SELECT c.comment_id, c.contents, c.created_at, cu.nickname AS commenter_nickname, cu.image_url AS commenter_image_url
        FROM comments c
        JOIN users cu ON c.user_id = cu.user_id
        WHERE c.post_id = ? AND c.is_deleted = FALSE
    `;
    const [commentRows] = await connectDB.query(commentSql, [postId]);

    // 포스트와 댓글 정보를 반환
    return {
        post_id: post[0].post_id,
        title: post[0].title,
        postImage: post[0].photo_url,
        content: post[0].contents,
        like_cnt: post[0].like_cnt,
        comment_cnt: post[0].comment_cnt,  // 댓글 갯수
        view_cnt: post[0].view_cnt,
        author: {
            user_id: post[0].user_id,
            nickname: post[0].author_nickname,
            profileImage: post[0].author_image_url
        },
        created_at: post[0].created_at,
        comments: commentRows.map(comment => ({
            comment_id: comment.comment_id,
            content: comment.contents,
            author: {
                user_id: comment.user_id,
                nickname: comment.commenter_nickname,
                profileImage: comment.commenter_image_url
            },
            created_at: comment.created_at
        }))
    };
}

// 게시글 업데이트 함수
async function updatePostModel(postId, title, content, postImage, imageFlag) {
    let sql = 'UPDATE posts SET title = ?, contents = ?, updated_at = Now()';
    const values = [title, content];
    console.log(imageFlag);
    if (imageFlag == 1) {
        sql += ', photo_url = ?';
        values.push(postImage);
    }

    sql += ' WHERE post_id = ?';
    values.push(postId);

    const [result] = await connectDB.query(sql, values);
    return result.affectedRows > 0;  // 업데이트 성공 여부 반환
}

// 게시글 삭제 함수
async function deletePostModel(postId) {
    const sql = 'UPDATE posts SET is_deleted = TRUE, updated_at = Now() WHERE post_id = ?';
    const [result] = await connectDB.query(sql, [postId]);
    return result.affectedRows > 0;  // 삭제 성공 여부 반환
}

export {
    getPostAuth,
    getAllPostsModel,
    createPostModel,
    getPostByIdModel,
    updatePostModel,
    deletePostModel,
};