import {
    getAllPostsModel,
    createPostModel,
    getPostByIdModel,
    updatePostModel,
    deletePostModel,
    generatePostIdModel
} from '../models/postModel.js';

// 모든 게시글 조회
const loadPosts = (req, res) => {
    try {
        const posts = getAllPostsModel();
        res.status(200).json({
            message: "posts_list_success",
            data: {
                posts: posts.map(post => ({
                    post_id: post.post_id,
                    title: post.title,
                    content: post.content,
                    like_cnt: post.like_cnt,
                    comment_cnt: post.comment_cnt,
                    view_cnt: post.view_cnt,
                    author: {
                        user_id: post.author.user_id,
                        nickname: post.author.nickname
                    },
                    created_at: post.created_at
                }))
            }
        });
    } catch (error) {
        console.error("게시글 로드 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};

// controllers/postController.js
const createPost = (req, res) => {
    try {
        console.log(req.body);
        const { title, content } = req.body;

        // 이미지 경로 처리
        const postImage = req.file ? `/uploads/postImages/${req.file.filename}` : null;
        const post_id = generatePostIdModel()
        // 작성자 정보와 댓글 구조를 미리 설정
        const author = {
            user_id: req.session.user.user_id, // 세션에 저장된 user_id 사용
            nickname: req.session.user.nickname,
            profileImage: req.session.user.profileImage || null
        };

        const newPost = {
            post_id,
            title,
            content,
            postImage,
            like_cnt: 0,
            comment_cnt: 0,
            view_cnt: 0,
            author,
            created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
            comments: [], // 기본적으로 빈 댓글 배열로 시작
        };

        // 새 게시글 데이터 저장
        createPostModel(newPost);

        res.status(201).json({ message: "post_created_success" });
    } catch (error) {
        console.error("게시글 생성 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};


// 특정 게시글 조회
const loadPostDetail = (req, res) => {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const post = getPostByIdModel(postId);
        if (!post) {
            return res.status(404).json({ message: "post_not_found" });
        }
        res.status(200).json({ message: "post_detail_success", data: post });
    } catch (error) {
        console.error("게시글 상세 조회 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};

// 게시글 수정
const updatePostDetail = (req, res) => {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const { title, content, imageFlag } = req.body;
        const postImage = req.file ? `/uploads/postImages/${req.file.filename}` : null;
        const updatedPost = updatePostModel(postId, title, content, postImage, imageFlag);
        if (!updatedPost) {
            return res.status(404).json({ message: "post_not_found" });
        }
        res.status(204).json({ message: "post_updated_success", data: updatedPost });
    } catch (error) {
        console.error("게시글 수정 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};

// 게시글 삭제
const deletePost = (req, res) => {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const isDeleted = deletePostModel(postId);
        if (!isDeleted) {
            return res.status(404).json({ message: "post_not_found" });
        }
        res.status(200).json({ message: "post_deleted_success" });
    } catch (error) {
        console.error("게시글 삭제 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};

export { loadPosts, createPost, loadPostDetail, updatePostDetail, deletePost };