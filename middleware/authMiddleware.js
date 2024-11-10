function authMiddleware(req, res, next) {
    if (req.session.user) {
        next(); // 인증된 경우 다음 미들웨어로 진행
    } else {
        res.status(400).json({ message: '로그인이 필요합니다.' }); // 로그인되지 않은 경우 400 반환
    }
}

module.exports = authMiddleware;