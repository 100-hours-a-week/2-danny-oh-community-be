const postsFilePath = path.join(__dirname, '../posts.json'); // 게시글 JSON 파일 경로

// 댓글 데이터를 저장하는 함수
function savePostsData(posts) {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
}

function getCommentById(post_id, comment_id){
    const posts = loadPostsData();
    const postIndex = posts.findIndex(post => post.post_id === post_id);
    return posts[postIndex].comments.find(comment => comment.comment_id === comment_id);
}
// 특정 게시글 조회 함수
function getPostById(postId) {
    const posts = loadPostsData();
    return posts.find(post => post.post_id === postId);
}

// 댓글 추가 함수
function addComment(post_id, comment) {
    const posts = loadPostsData();
    const postIndex = posts.findIndex(post => post.post_id === post_id);
    if (postIndex !== -1) {
        posts[postIndex].comments.push(comment)
        savePostsData(posts);
        return posts[postIndex].comment;
    }
    return null;
}

// 댓글 수정 함수
function editComment(post_id, comment_id, comment){
    const posts = loadPostsData();
    const postIndex = posts.findIndex(post => post.post_id === post_id);
    if (postIndex !== -1) {
        const commentIndex = posts[postIndex].comments.findIndex(comment => comment.comment_id === comment_id);
        posts[postIndex].comments[commentIndex].content = comment
        savePostsData(posts);
        return posts[postIndex].comments[commentIndex];
    }
    return null;
}

// 댓글 삭제 함수
function deleteComment(post_id, comment_id){
    const posts = loadPostsData();
    const postIndex = posts.findIndex(post => post.post_id === post_id);
    const initialLength = posts[postIndex].comments.length;
    posts[postIndex].comments = posts[postIndex].comments.filter(comment => comment.comment_id !== comment_id);
    if (posts[postIndex].comments.length < initialLength) {
        savePostsData(posts);
        return true;
    }
    return null;
}


module.exports = {
    getCommentById,
    addComment,
    editComment,
    deleteComment
};
