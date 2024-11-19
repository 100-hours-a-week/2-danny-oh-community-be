const fs = require('fs');
const path = require('path');
const postsFilePath = path.join(__dirname, '../posts.json'); // 게시글 JSON 파일 경로

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

// 마지막 post_id를 확인하여 +1을 반환하는 함수
function generatePostId() {
    const posts = loadPostsData();
    
    // posts 배열이 비어있다면 첫 번째 post_id는 1로 설정
    const lastPost = posts[0];
    
    return lastPost ? lastPost.post_id + 1 : 1;
}

// 게시글 전체 조회 함수
function getAllPosts() {
    return loadPostsData();
}

// 게시글 생성 함수
function createPost(newPost) {
    const posts = loadPostsData();
    posts.unshift(newPost);  // 최신 게시글을 배열 앞에 추가
    savePostsData(posts);
}

// 특정 게시글 조회 함수
function getPostById(postId) {
    const posts = loadPostsData();
    return posts.find(post => post.post_id === postId);
}

// 게시글 업데이트 함수
function updatePost(postId, title, content, postImage, imageFlag) {
    const posts = loadPostsData();
    const postIndex = posts.findIndex(post => post.post_id === postId);
    if (postIndex !== -1) {
        posts[postIndex].title = title;
        posts[postIndex].content = content;
        if(imageFlag == 1) posts[postIndex].postImage = postImage;
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
    deletePost,
    generatePostId
};
