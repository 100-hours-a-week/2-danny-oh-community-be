import { getCommentByIdModel } from '../models/commentModel.js'; // 댓글 관리 모델

const commentWriterMiddleware = async (req, res, next) => {
    const post_id = parseInt(req.params.post_id, 10);
    const comment_id = parseInt(req.params.comment_id, 10);
    const { user_id } = req.session.user; // 세션에서 user_id 가져오기

    // 댓글 정보 가져오기
    const comment = await getCommentByIdModel(comment_id); // 댓글 ID로 댓글 조회
    if (!comment) {
        return res.status(404).json({ message: 'comment_not_found' }); // 댓글이 없으면 404 반환
    }
    // 댓글의 author.user_id와 세션의 user_id 비교
    if (comment.user_id !== user_id) {
        return res.status(403).json({ message: 'not_resource_owner' }); // 권한이 없으면 403 반환
    }

    // 일치하면 다음 미들웨어로 넘어감
    next();
};

export default commentWriterMiddleware;
