import { getPostAuth } from '../models/postModel.js'; // 게시글 관리 모델

const writerMiddleware = async (req, res, next) => {
    const { post_id } = req.params; // 요청된 게시글 ID
    const { user_id } = req.session.user; // 세션에서 user_id 가져오기

    // 게시글 정보 가져오기
    const post = await getPostAuth(parseInt(post_id, 10)); // 게시글 ID로 게시글 조회
    if (!post) {
        return res.status(404).json({ message: 'post_not_found' }); // 게시글이 없으면 404 반환
    }

    // 게시글의 author.user_id와 세션의 user_id 비교
    if (post.user_id !== user_id) {
        return res.status(403).json({ message: 'not_resource_owner' }); // 권한이 없으면 403 반환
    }

    // 일치하면 다음 미들웨어로 넘어감
    next();
};

export default writerMiddleware;
