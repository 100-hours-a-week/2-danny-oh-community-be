const userModel = require('../models/userModel');
const path = require('path');
const fs = require('fs');

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
        const { nickname } = req.body;
        // 이미지 경로 처리
        const profileImage = req.file ? `/uploads/profileImages/${req.file.filename}` : null;

        // 사용자 정보를 업데이트하기 전에 기존 이미지 파일과 비교
        if (profileImage && req.session.user.profileImage && profileImage !== req.session.user.profileImage) {
            // 기존 이미지 경로가 존재하고, 새 이미지 경로가 다르면 기존 파일 삭제
            const oldProfileImagePath = path.join(__dirname, '..', req.session.user.profileImage);
            if (fs.existsSync(oldProfileImagePath)) {
                fs.unlinkSync(oldProfileImagePath);  // 기존 파일 삭제
            }
        }

        // 프로필 업데이트
        userModel.updateProfile(user_id, nickname, profileImage);  

        // 세션에 최신 정보 반영
        req.session.user.nickname = nickname;
        req.session.user.profileImage = profileImage;

        res.status(200).json({ message: '프로필이 업데이트되었습니다.' });
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
        res.status(200).json({ message: '비밀번호가 업데이트되었습니다.' });
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