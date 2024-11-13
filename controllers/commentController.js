const commentModel = require('../models/commentModel');
// 댓글 생성
const createComment = (req, res) => {
    try {
        console.log(req.body);
        const { content } = req.body;
        const post_id = parseInt(req.params.post_id, 10);

        // 작성자 정보 설정
        const author = {
            user_id: req.session.user.user_id, // 세션에 저장된 user_id 사용
            nickname: req.session.user.nickname,
            profileImage: req.session.user.profileImage || null
        };
        const comment_id = commentModel.generateCommentId(post_id);
        const newComment = {
            comment_id,
            content,
            author,
            created_at: new Date().toISOString(),
        };

        // 새 댓글 데이터 저장
        commentModel.addComment(post_id, newComment);

        res.status(201).json({ message: "comment_create_success" });
    } catch (error) {
        console.error("댓글 생성 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};


// 댓글 수정
const updateComment = (req, res) => {
    try {
        const post_id = parseInt(req.params.post_id, 10);
        const comment_id = parseInt(req.params.comment_id, 10);
        const { content } = req.body;
        const updatedPost = commentModel.editComment(post_id, comment_id, content);
        if (!updatedPost) {
            return res.status(404).json({ message: "comment_not_found" });
        }
        res.status(200).json({ message: "comment_updated_success", data: updatedPost });
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
        const isDeleted = commentModel.deleteComment(post_id, comment_id);
        if (!isDeleted) {
            return res.status(404).json({ message: "comment_not_found" });
        }
        res.status(200).json({ message: "comment_deleted_success" });
    } catch (error) {
        console.error("댓글 삭제 오류:", error);
        res.status(500).json({ message: "internal_server_error" });
    }
};

module.exports = {
    createComment,
    updateComment,
    deleteComment
};
