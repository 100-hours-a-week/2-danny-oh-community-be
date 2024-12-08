import {
    loadUsersModel,
    findUserByEmailModel, 
    addUserModel,
    findUserByNicknamelModel} from '../models/userModel.js';

import multer from 'multer';
import FormData from 'form-data'; // Form-Data 라이브러리
import fetch from 'node-fetch';

// Multer 메모리 저장소 설정
const upload = multer({ storage: multer.memoryStorage() });

const signUp = async (req, res) => {
    try {
        const { email, password, nickname } = req.body;
        let profileImage;
        // 필수 필드 검증
        if (!email || !password || !nickname) {
            return res.status(400).json({
                success: false,
                message: '필수 항목이 누락되었습니다.'
            });
        }

        // 이메일 중복 체크
        if ( await findUserByEmailModel(email) > 0) {
            return res.status(400).json({
                success: false,
                message: '이미 존재하는 이메일입니다.'
            });
        }

        if ( await findUserByNicknamelModel(nickname) > 0) {
            return res.status(401).json({
                success: false,
                message: '이미 존재하는 닉네임입니다.'
            });
        }

        if (req.file){
            try {
                const formData = new FormData();
                formData.append('file', req.file.buffer, req.file.originalname); // 버퍼와 파일 이름 사용
                const response = await fetch(`http://localhost:4000/upload/profileImage`, {
                    method: 'POST',
                    body: formData,
                });
                if (response.status === 200) {
                    const data = await response.json();
                    profileImage = data.fileUrl;
                } else {
                    console.error('이미지 업로드 실패:', response.status);
                }
            } catch (uploadError) {
                console.error('이미지 업로드 중 오류 발생:', uploadError);
            }
        } else{
            profileImage = null;
        }

        // 새 사용자 추가
        const newUser = {
            email,
            password,
            nickname,
            profileImage
        };

        await addUserModel(newUser);

        res.status(201).json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            user: {
                email,
                nickname,
                profileImage
            }
        });

    } catch (error) {
        console.error('회원가입 에러:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loadUsersModel(email, password);
        if (user == '0') {
            return res.status(400).json({ message: '잘못된 이메일 또는 비밀번호입니다.' });
        }
        console.log(user);
        req.session.user = { 
            user_id: user.user_id,
            email: user.email, 
            nickname: user.nickname, 
            profileImage: user.image_url 
        };
        res.json({ message: '로그인 성공!' });
    } catch (error) {
        console.error('로그인 에러:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
};

export { signUp, login };
