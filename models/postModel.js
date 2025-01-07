import pool from '../db.js'; // 연결 풀 가져오기

// 게시글 전체 조회 함수
async function getAllPostsModel(page, limit) {
    const offset = (page - 1) * limit; // OFFSET 계산

    const sql = `
        SELECT p.*, u.nickname, u.email, u.image_url 
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        WHERE p.is_deleted = FALSE AND u.is_deleted = FALSE
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    `;

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(sql, [limit, offset]); // limit와 offset을 쿼리에 전달
        return rows;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// 게시글 생성 함수
async function createPostModel(newPost) {
    const { title, content, postImage, user_id } = newPost;
    const sql = `
        INSERT INTO posts (title, contents, photo_url, user_id, created_at) 
        VALUES (?, ?, ?, ?, NOW())
    `;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(sql, [title, content, postImage, user_id]);
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// 특정 게시글의 작성자 확인
async function getPostAuth(postId) {
    const sql = `SELECT user_id FROM posts WHERE post_id = ?`;

    let connection;
    try {
        connection = await pool.getConnection();
        const [post] = await connection.query(sql, [postId]);
        return post[0] || null; // 작성자 정보 반환
    } catch (error) {
        console.error('Error fetching post author:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// 특정 게시글 조회 함수
async function getPostByIdModel(postId) {
    const postSql = `
        SELECT p.*, u.nickname AS author_nickname, u.image_url AS author_image_url
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        WHERE p.post_id = ? AND p.is_deleted = FALSE
    `;
    const commentSql = `
        SELECT c.user_id, c.comment_id, c.contents, c.created_at, cu.nickname AS commenter_nickname, cu.image_url AS commenter_image_url
        FROM comments c
        JOIN users cu ON c.user_id = cu.user_id
        WHERE c.post_id = ? AND c.is_deleted = FALSE AND cu.is_deleted = FALSE
    `;

    let connection;
    try {
        connection = await pool.getConnection();
        const [post] = await connection.query(postSql, [postId]);
        if (post.length === 0) {
            return null;
        }

        const [comments] = await connection.query(commentSql, [postId]);
        return {
            post_id: post[0].post_id,
            title: post[0].title,
            postImage: post[0].photo_url,
            content: post[0].contents,
            like_cnt: post[0].like_cnt,
            comment_cnt: post[0].comment_cnt,
            view_cnt: post[0].view_cnt,
            author: {
                user_id: post[0].user_id,
                nickname: post[0].author_nickname,
                profileImage: post[0].author_image_url,
            },
            created_at: post[0].created_at,
            comments: comments.map((comment) => ({
                comment_id: comment.comment_id,
                content: comment.contents,
                author: {
                    user_id: comment.user_id,
                    nickname: comment.commenter_nickname,
                    profileImage: comment.commenter_image_url,
                },
                created_at: comment.created_at,
            })),
        };
    } catch (error) {
        console.error('Error fetching post details:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// 게시글 조회수 증가 함수
async function viewCountModel(postId) {
    const sql = `
        UPDATE posts 
        SET view_cnt = view_cnt + 1
        WHERE post_id = ? AND is_deleted = FALSE
    `;

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.query(sql, [postId]);
    } catch (error) {
        console.error('Error updating view count:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

// 게시글 수정 함수
async function updatePostModel(postId, title, content, postImage, imageFlag) {
    let sql = 'UPDATE posts SET title = ?, contents = ?, updated_at = Now()';
    const values = [title, content];
    if (imageFlag == 1) {
        sql += ', photo_url = ?';
        values.push(postImage);
    }
    sql += ' WHERE post_id = ?';
    values.push(postId);

    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(sql, values);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

async function likePostCheckModel(postId, userId) {
    const checkLikeSql = 'SELECT COUNT(*) AS count FROM likes WHERE user_id = ? AND post_id = ?';

    let connection;
    try {
        connection = await pool.getConnection();

        // 좋아요 상태 확인
        const [result] = await connection.query(checkLikeSql, [userId, postId]);
        const isLiked = result[0].count > 0;

        return isLiked ? 1 : 0; // 1: 좋아요 상태, 0: 좋아요 상태 아님
    } catch (error) {
        console.error('Error checking like status:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}


async function likePostModel(postId, userId) {
    const checkLikeSql = 'SELECT * FROM likes WHERE user_id = ? AND post_id = ?';
    const insertLikeSql = 'INSERT INTO likes (user_id, post_id) VALUES (?, ?)';
    const deleteLikeSql = 'DELETE FROM likes WHERE user_id = ? AND post_id = ?';
    const incrementLikeCountSql = 'UPDATE posts SET like_cnt = like_cnt + 1 WHERE post_id = ?';
    const decrementLikeCountSql = 'UPDATE posts SET like_cnt = like_cnt - 1 WHERE post_id = ?';
    const getLikeCountSql = 'SELECT like_cnt FROM posts WHERE post_id = ?';

    let connection;
    try {
        connection = await pool.getConnection();

        // 트랜잭션 시작
        await connection.beginTransaction();

        // 좋아요 상태 확인
        const [likeResult] = await connection.query(checkLikeSql, [userId, postId]);
        const isLiked = likeResult.length > 0;

        if (isLiked) {
            // 좋아요 취소
            await connection.query(deleteLikeSql, [userId, postId]);
            await connection.query(decrementLikeCountSql, [postId]);
        } else {
            // 좋아요 추가
            await connection.query(insertLikeSql, [userId, postId]);
            await connection.query(incrementLikeCountSql, [postId]);
        }

        // 현재 좋아요 수 조회
        const [likeCountResult] = await connection.query(getLikeCountSql, [postId]);
        const likeCount = likeCountResult[0]?.like_cnt || 0;

        // 트랜잭션 커밋
        await connection.commit();

        return { isLiked: !isLiked, likeCount }; // isLiked: true(좋아요 추가), false(좋아요 취소)
    } catch (error) {
        if (connection) {
            await connection.rollback(); // 트랜잭션 롤백
        }

        console.error('Error toggling like:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}



// 게시글 삭제 함수
async function deletePostModel(postId) {
    const sql = 'UPDATE posts SET is_deleted = TRUE, updated_at = Now() WHERE post_id = ?';

    let connection;
    try {
        connection = await pool.getConnection();
        const [result] = await connection.query(sql, [postId]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    } finally {
        if (connection) connection.release();
    }
}

export {
    getPostAuth,
    getAllPostsModel,
    createPostModel,
    getPostByIdModel,
    updatePostModel,
    deletePostModel,
    likePostModel,
    viewCountModel,
    likePostCheckModel
};
