const postsFilePath = path.join(__dirname, '../posts.json'); // 게시글 JSON 파일 경로

// 게시글 데이터를 저장하는 함수
function savePostsData(posts) {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
}

// 댓글 추가 함수
function addComment(postId, comment) {
    const posts = loadPostsData();
    const postIndex = posts.findIndex(post => post.post_id === postId);
    if (postIndex !== -1) {
        posts[postIndex].comments.push(comment)
        savePostsData(posts);
        return posts[postIndex].comments;
    }
    return null;
}

// 댓글 수정 함수
function editComment(postId, comment_id, comment){
    const posts = loadPostsData();
    const postIndex = posts.findIndex(post => post.post_id === postId);
    if (postIndex !== -1) {
        const commentIndex = posts[postIndex].comments.findIndex(comment => comment.comment_id === comment_id);
        posts[postIndex].comments[commentIndex].content = comment
        savePostsData(posts);
        return posts[postIndex].comments[commentIndex];
    }
    return null;
}

// 댓글 삭제 함수
function deleteComment(postId, comment_id){
    const posts = loadPostsData();
    const postIndex = posts.findIndex(post => post.post_id === postId);
    const initialLength = posts[postIndex].comments.length;
    posts[postIndex].comments = posts[postIndex].comments.filter(comment => comment.comment_id !== comment_id);
    if (posts[postIndex].comments.length < initialLength) {
        savePostsData(posts);
        return true;
    }
    return null;
}