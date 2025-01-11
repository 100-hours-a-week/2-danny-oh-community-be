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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    try {
        const posts = await getAllPostsModel(page, limit);
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
                    created_at: post.created_at,
                    updated_at: post.updated_at
                }))
            }
        });
    } catch (error) {
        console.error("게시글 로드 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};

// 게시글 작성
const createPost = async (req, res) => {
    try {
        console.log(req.body);
        const { title, content } = req.body;
        const postImage = req.file ? `https://d1nq974808g33j.cloudfront.net/${req.file.key}` : null;

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

import deleteFile from '../utils/deletePostUtils.js';
// 게시글 수정
const updatePostDetail = async (req, res) => {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const { title, content, imageFlag } = req.body;
        if (imageFlag == 1) {
            const post = await getPostByIdModel(postId);
            if (post.postImage){
                const fileKey = post.postImage.replace('https://d1nq974808g33j.cloudfront.net/', '');
                deleteFile(fileKey);
            }
        }
        const postImage = req.file ? `https://d1nq974808g33j.cloudfront.net/${req.file.key}` : null;
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

// 조회수
const viewCntPost = async (req, res) => {
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

// 좋아요
const likePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const { user_id } = req.session.user; // 세션에서 user_id 가져오기
        // 좋아요 처리 (좋아요 추가/취소 및 최신 like_cnt 반환)
        const { likeCount, isLiked } = await likePostModel(postId, user_id);

        // 좋아요 처리 결과 반환
        res.status(200).json({
            likeCount,
            isLiked, // true: 좋아요 추가됨, false: 좋아요 취소됨
        });
    } catch (error) {
        console.error("게시글 좋아요 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};


// 게시글 삭제
const deletePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.post_id, 10);
        const post = await getPostByIdModel(postId);
        if (post.postImage){
            const fileKey = post.postImage.replace('https://d1nq974808g33j.cloudfront.net/', '');
            deleteFile(fileKey);
        }
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

export { loadPosts, createPost, loadPostDetail, updatePostDetail, deletePost, likePost, viewCntPost };