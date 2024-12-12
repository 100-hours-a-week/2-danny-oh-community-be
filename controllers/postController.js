import {
    getAllPostsModel,
    createPostModel,
    getPostByIdModel,
    updatePostModel,
    deletePostModel,
    likePostModel,
    viewCountModel
} from '../models/postModel.js';

// 모든 게시글 조회
const loadPosts = async (req, res) => {
    try {
        const posts = await getAllPostsModel();
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
                        user_id: post.user_id,
                        nickname: post.nickname
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
const createPost = async (req, res) => {
    try {
        console.log(req.body);
        const { title, content } = req.body;
        const postImage = req.file ? req.file.location : null;

        const newPost = {
            title,
            content,
            postImage,
            like_cnt: 0,
            comment_cnt: 0,
            view_cnt: 0,
            user_id: req.session.user.user_id,
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
const loadPostDetail = async (req, res) => {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const post = await getPostByIdModel(postId);
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
const updatePostDetail = async (req, res) => {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const { title, content, imageFlag } = req.body;
        const postImage = req.file ? req.file.location : null;
        // 기존 게시글 데이터 가져오기
        const existingPost = await getPostByIdModel(postId);
        if (!existingPost) {
            return res.status(404).json({ message: "post_not_found" });
        }

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

const viewcntPost = async (req, res) => {
    try{
        const postId = parseInt(req.params.post_id, 10);
        await viewCountModel(postId)
        res.status(204).json({ message: "increase_view_cnt" });
    }
    catch (error){
        console.error("게시글 좋아요 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
}

const likePost = async (req, res) => {
    try{
        const postId = parseInt(req.params.post_id, 10);
        const updatedPost = await likePostModel(postId)

        if (!updatedPost) {
            return res.status(404).json({ message: "post_not_found" });
        }
        res.status(204).json({ message: "post_like_success", data: updatedPost });
    }
    catch (error){
        console.error("게시글 좋아요 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
}

// 게시글 삭제
const deletePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const isDeleted = await deletePostModel(postId);
        if (!isDeleted) {
            return res.status(404).json({ message: "post_not_found" });
        }
        res.status(200).json({ message: "post_deleted_success" });
    } catch (error) {
        console.error("게시글 삭제 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};

export { loadPosts, createPost, loadPostDetail, updatePostDetail, deletePost, likePost, viewcntPost };