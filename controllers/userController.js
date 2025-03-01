import {
    updateProfileModel,
    updatePasswordModel,
    deleteUserModel,
    findUserByNicknameModel} from '../models/userModel.js';

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

import deleteFile from '../utils/deleteProfileUtils.js';
const updateUserProfile = async (req, res) => {
    try {
        const { user_id } = req.session.user;
        const { nickname, imageFlag } = req.body;

        // 필수 필드 검증
        if (!nickname || !imageFlag) {
            return res.status(400).json({
                success: false,
                message: '필수 항목이 누락되었습니다.'
            });
        }
        
        const existingUserCount = await findUserByNicknameModel(nickname);

        if (existingUserCount >= 1 && nickname !== req.session.user.nickname) {
            return res.status(401).json({
                success: false,
                message: '이미 존재하는 닉네임입니다.',
            });
        }
        const profileImage = req.file ? `https://d1nq974808g33j.cloudfront.net/${req.file.key}` : null;

        // 사용자 정보 업데이트
        updateProfileModel(user_id, nickname, profileImage, imageFlag);
        
        // 세션에 최신 정보 반영
        
        // 이미지 변경이 요청된 경우
        if (imageFlag == 1) {
            if (req.session.user.profileImage){
                const fileKey = req.session.user.profileImage.replace('https://d1nq974808g33j.cloudfront.net/', '');
                deleteFile(fileKey);
            }
            req.session.user.profileImage = profileImage;
        }
        req.session.user.nickname = nickname;

        res.status(204).json({ message: '프로필이 업데이트되었습니다.' });
    } catch (error) {
        console.error('프로필 업데이트 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};


// 사용자 비밀번호 업데이트
const updateUserPass= async (req, res) => {
    try {
        const { user_id } = req.session.user;
        const { newPassword } = req.body;
        // 필수 필드 검증
        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message: '필수 항목이 누락되었습니다.'
            });
        }
        await updatePasswordModel(user_id, newPassword);
        res.status(204).json({ message: '비밀번호가 업데이트되었습니다.' });
    } catch (error) {
        console.error('비밀번호 업데이트 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 사용자 삭제
const deleteUser= async (req, res) => {
    try {
        const { user_id, profileImage } = req.session.user;
        await deleteUserModel(user_id);
        // 프로필 이미지 삭제
        if (req.session.user.profileImage){
            const fileKey = profileImage.replace('https://d1nq974808g33j.cloudfront.net/', '');
            deleteFile(fileKey);
        }
        req.session.destroy(); // 세션 삭제
        res.status(200).json({ message: '사용자 계정이 삭제되었습니다.' });
    } catch (error) {
        console.error('사용자 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};


export { getUser, updateUserProfile, updateUserPass, deleteUser, logout };