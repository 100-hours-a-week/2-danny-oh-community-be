const postModel = require('../models/commentModel'); // 게시글을 관리하는 모델

const commentWriterMiddleware = (req, res, next) => {
    const post_id = parseInt(req.params.post_id, 10);
    const comment_id = parseInt(req.params.comment_id, 10);
    const { user_id } = req.session.user;  // 세션에서 user_id 가져오기
    
    // 게시글 정보 가져오기
    const comment = postModel.getCommentById(parseInt(post_id, 10), parseInt(comment_id, 10)); // 게시글 ID로 포스트 조회
    // 게시글의 author.user_id와 세션의 user_id 비교
    if (comment.author.user_id !== user_id) {
        return res.status(403).json({ message: 'not_resource_owner' });  // 권한이 없으면 403 상태 코드
    }

    // 일치하면 다음 미들웨어나 라우터로 넘어감
    next();
};

module.exports = commentWriterMiddleware;
