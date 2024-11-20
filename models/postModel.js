import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const postsFilePath = path.join(__dirname, '../posts.json');

// 게시글 데이터를 로드하는 함수
function loadPostsDataModel() {
    if (!fs.existsSync(postsFilePath)) {
        fs.writeFileSync(postsFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(postsFilePath);
    return JSON.parse(data);
}

// 게시글 데이터를 저장하는 함수
function savePostsDataModel(posts) {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
}

// 마지막 post_id를 확인하여 +1을 반환하는 함수
function generatePostIdModel() {
    const posts = loadPostsDataModel();
    
    // posts 배열이 비어있다면 첫 번째 post_id는 1로 설정
    const lastPost = posts[0];
    
    return lastPost ? lastPost.post_id + 1 : 1;
}

// 게시글 전체 조회 함수
function getAllPostsModel() {
    return loadPostsDataModel();
}

// 게시글 생성 함수
function createPostModel(newPost) {
    const posts = loadPostsDataModel();
    posts.unshift(newPost);  // 최신 게시글을 배열 앞에 추가
    savePostsDataModel(posts);
}

// 특정 게시글 조회 함수
function getPostByIdModel(postId) {
    const posts = loadPostsDataModel();
    return posts.find(post => post.post_id === postId);
}

// 게시글 업데이트 함수
function updatePostModel(postId, title, content, postImage, imageFlag) {
    const posts = loadPostsDataModel();
    const postIndex = posts.findIndex(post => post.post_id === postId);
    if (postIndex !== -1) {
        posts[postIndex].title = title;
        posts[postIndex].content = content;
        if(imageFlag == 1) posts[postIndex].postImage = postImage;
        savePostsDataModel(posts);
        return posts[postIndex];
    }
    return null;
}

// 게시글 삭제 함수
function deletePostModel(postId) {
    let posts = loadPostsDataModel();
    const initialLength = posts.length;
    posts = posts.filter(post => post.post_id !== postId);
    if (posts.length < initialLength) {
        savePostsDataModel(posts);
        return true;
    }
    return false;
}

export {
    getAllPostsModel,
    createPostModel,
    getPostByIdModel,
    updatePostModel,
    deletePostModel,
    generatePostIdModel
};