const fs = require('fs');
const path = require('path');
const postsFilePath = path.join(__dirname, '../data/posts.json'); // 게시글 JSON 파일 경로

// 게시글 데이터를 로드하는 함수
function loadPostsData() {
    if (!fs.existsSync(postsFilePath)) {
        fs.writeFileSync(postsFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(postsFilePath);
    return JSON.parse(data);
}

// 게시글 데이터를 저장하는 함수
function savePostsData(posts) {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
}

// 마지막 post_id를 가져와서 1 증가시키는 함수
function generatePostId() {
    const posts = loadPostsData();
    const lastPost = posts[posts.length - 1];
    return lastPost ? lastPost.post_id + 1 : 1; // 첫 번째 사용자는 1로 설정
}

// 게시글 전체 조회 함수
function getAllPosts() {
    return loadPostsData();
}

// 게시글 생성 함수
function createPost(newPost) {
    const posts = loadPostsData();
    newPost.post_id = generatePostId(); // user_id 생성
    posts.push(newPost);
    savePostsData(posts);
}

// 특정 게시글 조회 함수
function getPostById(postId) {
    const posts = loadPostsData();
    return posts.find(post => post.post_id === postId);
}

// 게시글 업데이트 함수
function updatePost(postId, updatedData) {
    const posts = loadPostsData();
    const postIndex = posts.findIndex(post => post.post_id === postId);
    if (postIndex !== -1) {
        posts[postIndex] = { ...posts[postIndex], ...updatedData };
        savePostsData(posts);
        return posts[postIndex];
    }
    return null;
}

// 게시글 삭제 함수
function deletePost(postId) {
    let posts = loadPostsData();
    const initialLength = posts.length;
    posts = posts.filter(post => post.post_id !== postId);
    if (posts.length < initialLength) {
        savePostsData(posts);
        return true;
    }
    return false;
}

module.exports = {
    getAllPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost
};
