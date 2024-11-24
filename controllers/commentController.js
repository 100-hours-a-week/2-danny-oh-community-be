import {
    addCommentModel,
    editCommentModel,
    deleteCommentModel,
} from '../models/commentModel.js';

// 댓글 생성
const createComment = (req, res) => {
    try {
        console.log(req.body);
        const { content } = req.body;
        const post_id = parseInt(req.params.post_id, 10);
        const newComment = {
            content,
            user_id: req.session.user.user_id,
        };
        // 새 댓글 데이터 저장
        addCommentModel(post_id, newComment);

        res.status(201).json({ message: "comment_create_success" });
    } catch (error) {
        console.error("댓글 생성 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};


// 댓글 수정
const updateComment = async (req, res) => {
    try {
        const comment_id = parseInt(req.params.comment_id, 10);
        const { content } = req.body;
        const updatedPost = await editCommentModel(comment_id, content);
        if (updatedPost == 0) {
            return res.status(404).json({ message: "comment_not_found" });
        }
        res.status(200).json({ message: "comment_updated_success", data: content });
    } catch (error) {
        console.error("댓글 수정 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};

// 댓글 삭제
const deleteComment = (req, res) => {
    try {
        const post_id = parseInt(req.params.post_id, 10);
        const comment_id = parseInt(req.params.comment_id, 10);
        const isDeleted = deleteCommentModel(post_id, comment_id);
        if (isDeleted == 0) {
            return res.status(404).json({ message: "comment_not_found" });
        }
        res.status(200).json({ message: "comment_deleted_success" });
    } catch (error) {
        console.error("댓글 삭제 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};

export { createComment, updateComment, deleteComment };