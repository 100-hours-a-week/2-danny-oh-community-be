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

const updateUserProfile = async (req, res) => {
    try {
        const { user_id } = req.session.user;
        const { nickname, imageFlag } = req.body;
        let profileImage = req.file ? `/uploads/profileImages/${req.file.filename}` : null;
        console.log(imageFlag);
        // 이미지 변경이 요청된 경우
        if (imageFlag == 1) {
            console.log(imageFlag);
            // 세션에 새로운 프로필 이미지 경로 저장
            req.session.user.profileImage = profileImage;
        } else {
            // 이미지 변경이 요청되지 않은 경우 기존 이미지를 유지
            profileImage = req.session.user.profileImage || null;
        }

        // 사용자 정보 업데이트
        userModel.updateProfile(user_id, nickname, profileImage, imageFlag);

        // 세션에 최신 정보 반영
        req.session.user.nickname = nickname;

        res.status(204).json({ message: '프로필이 업데이트되었습니다.' });
    } catch (error) {
        console.error('프로필 업데이트 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};



// 사용자 비밀번호 업데이트
const updateUserPass= (req, res) => {
    try {
        const { user_id } = req.session.user;
        const { newPassword } = req.body;
        userModel.updatePassword(user_id, newPassword);
        res.status(204).json({ message: '비밀번호가 업데이트되었습니다.' });
    } catch (error) {
        console.error('비밀번호 업데이트 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 사용자 삭제
const deleteUser= (req, res) => {
    try {
        const { user_id } = req.session.user;
        userModel.deleteUser(user_id);
        req.session.destroy(); // 세션 삭제
        res.status(200).json({ message: '사용자 계정이 삭제되었습니다.' });
    } catch (error) {
        console.error('사용자 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};



module.exports = { getUser, updateUserProfile, updateUserPass, deleteUser, logout };