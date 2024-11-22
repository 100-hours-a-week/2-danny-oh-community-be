import fs from 'fs';
import path from 'path';
// __dirname 설정 (ES 모듈 환경에서 __dirname 사용)

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const postsFilePath = path.join(__dirname, '../posts.json'); // 게시글 JSON 파일 경로

// 게시글 데이터를 로드하는 함수
function loadPostsDataModel() {
    if (!fs.existsSync(postsFilePath)) {
        fs.writeFileSync(postsFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(postsFilePath);
    return JSON.parse(data);
}

// 댓글 데이터를 저장하는 함수
function savePostsDataModel(posts) {
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
}

function getCommentByIdModel(post_id, comment_id){
    const posts = loadPostsDataModel();
    const postIndex = posts.findIndex(post => post.post_id === post_id);
    return posts[postIndex].comments.find(comment => comment.comment_id === comment_id);
}

// 마지막 comment_id를 확인하여 +1을 반환하는 함수
function generateCommentIdModel(post_id) {
    const posts = loadPostsDataModel();
    
    // post_id에 해당하는 게시글 찾기
    const post = posts.find(post => post.post_id === post_id);
    
    // 해당 post가 없거나 comments 배열이 없을 경우 예외 처리
    if (!post || !post.comments) {
        return 1; // 첫 번째 댓글은 1로 설정
    }

    const comments = post.comments;
    const lastComment = comments[comments.length - 1];
    
    // 마지막 댓글의 comment_id에 +1 반환, 또는 댓글이 없다면 1 반환
    return lastComment ? lastComment.comment_id + 1 : 1;
}

// 댓글 추가 함수
function addCommentModel(post_id, newComment) {
    console.log(newComment);
    const posts = loadPostsDataModel();
    const postIndex = posts.findIndex(post => post.post_id === post_id);
    console.log(posts[postIndex]);
    if (postIndex !== -1) {
        console.log(posts[postIndex]);
        posts[postIndex].comments.push(newComment)
        posts[postIndex].comment_cnt += 1;
        savePostsDataModel(posts);
        return posts[postIndex].comments;
    }
    return null;
}

// 댓글 수정 함수
function editCommentModel(post_id, comment_id, comment){
    const posts = loadPostsDataModel();
    const postIndex = posts.findIndex(post => post.post_id === post_id);
    if (postIndex !== -1) {
        const commentIndex = posts[postIndex].comments.findIndex(comment => comment.comment_id === comment_id);
        posts[postIndex].comments[commentIndex].content = comment
        savePostsDataModel(posts);
        return posts[postIndex].comments[commentIndex];
    }
    return null;
}

// 댓글 삭제 함수
function deleteCommentModel(post_id, comment_id){
    const posts = loadPostsDataModel();
    const postIndex = posts.findIndex(post => post.post_id === post_id);
    const initialLength = posts[postIndex].comments.length;
    posts[postIndex].comments = posts[postIndex].comments.filter(comment => comment.comment_id !== comment_id);
    if (posts[postIndex].comments.length < initialLength) {
        posts[postIndex].comment_cnt -= 1;
        savePostsDataModel(posts);
        return true;
    }
    return null;
}


export {
    getCommentByIdModel,
    addCommentModel,
    editCommentModel,
    deleteCommentModel,
    generateCommentIdModel
};