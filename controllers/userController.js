const userModel = require('../models/userModel');

const getUser = (req, res) => {
    try {
        const user = req.session.user; // 세션에서 사용자 데이터 가져오기
        res.status(200).json(user);
    } catch (error) {
        console.error('사용자 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

const logout = (req, res) => {
    try {
        req.session.destroy(); // 세션 삭제
        res.status(200).json({ message: '로그아웃 되었습니다.' });
    } catch (error) {
        console.error('로그아웃 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}


module.exports = { getUser, updateUserProfile, updateUserPass, deleteUser, logout };