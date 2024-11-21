import {
    loadUsersModel,
    findUserByEmailModel, 
    addUserModel} from '../models/userModel.js';


const signUp = async (req, res) => {
    try {
        console.log('회원가입 처리 시작', req.body);
        console.log('업로드된 파일:', req.file);

        const { email, password, nickname } = req.body;
        
        // 필수 필드 검증
        if (!email || !password || !nickname) {
            return res.status(400).json({
                success: false,
                message: '필수 항목이 누락되었습니다.'
            });
        }
        // 이미지 경로 처리
        const profileImage = req.file ? `/uploads/profileImages/${req.file.filename}` : null;

        // 이메일 중복 체크
        if ( await findUserByEmailModel(email) > 0) {
            return res.status(400).json({
                success: false,
                message: '이미 존재하는 이메일입니다.'
            });
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
        if (user == 0) {
            return res.status(400).json({ message: '잘못된 이메일 또는 비밀번호입니다.' });
        }
        console.log(user);
        req.session.user = { 
            user_id: user.user_id,
            email: user.email, 
            nickname: user.nickname, 
            profileImage: user.profileImage 
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
