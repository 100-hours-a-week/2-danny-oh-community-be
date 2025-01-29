import {
    loadUsersModel,
    findUserByEmailModel, 
    addUserModel,
    findUserByNicknameModel,
    findKakaoUserByNicknameModel} from '../models/userModel.js';
import axios from 'axios';

const signUp = async (req, res) => {
    try {
        const { email, password, nickname } = req.body;
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

        if ( await findUserByNicknameModel(nickname) > 0) {
            return res.status(401).json({
                success: false,
                message: '이미 존재하는 닉네임입니다.'
            });
        }

        const profileImage = req.file ? `https://d1nq974808g33j.cloudfront.net/${req.file.key}` : null;

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

        // 사용자 인증
        const user = await loadUsersModel(email, password);
        if (user) {console.log(user);
            // 기존 세션 제거
            const sessionStore = req.sessionStore;
            if (sessionStore && sessionStore.sessions) {
                Object.entries(sessionStore.sessions).forEach(([sessionId, sessionData]) => {
                    const parsedData = JSON.parse(sessionData); // 세션 데이터는 JSON 문자열로 저장됨
                    if (parsedData.user && parsedData.user.user_id === user.user_id) {
                        console.log(`기존 세션 제거: ${sessionId}`);
                        sessionStore.destroy(sessionId, (err) => {
                            if (err) {
                                console.error('세션 제거 중 오류:', err);
                            }
                        });
                    }
                });
            }
            req.session.user = { 
                user_id: user.user_id,
                email: user.email, 
                nickname: user.nickname, 
                profileImage: user.image_url 
            };
            res.json({ message: '로그인 성공!' }); 
        }else{
            console.log(user);
            res.status(500).json({ message: '잘못된 이메일 또는 비밀번호입니다.' });                              
        }
    } catch (error) {
        console.error('로그인 에러:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.'
        });
    }
};

const kakao = async (req, res) => {
    const { code } = req.query; // 카카오에서 전달된 인증 코드

    try {
        // Access Token 요청
        const tokenResponse = await axios.post(
            'https://kauth.kakao.com/oauth/token',
            null,
            {
                params: {
                    grant_type: 'authorization_code',
                    client_id: '460b66b189d9e6618b2397d5522cdcfa', // 환경 변수에서 Client ID 가져오기
                    redirect_uri: 'http://13.209.17.149/api/auth/kakao', // 등록된 Redirect URI
                    code, // 전달된 인증 코드
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // 사용자 정보 요청
        const userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const user = userResponse.data;
        let user_id = await findKakaoUserByNicknameModel(user.properties.nickname);

        if (user_id == -1){
            // 새 사용자 추가
            const newUser = {
                email : 'kakao',
                password : '카카오 로그인 유저입니다',
                nickname : user.properties.nickname,
                profileImage : user.properties.thumbnail_image 
            };

            await addUserModel(newUser);
        }

        user_id = await findKakaoUserByNicknameModel(user.properties.nickname);

        req.session.user = { 
            user_id: user_id,
            email: 'kakao', 
            nickname: user.properties.nickname, 
            profileImage: user.properties.thumbnail_image 
        };
        res.redirect('/posts');
    } catch (error) {
        console.error('카카오 로그인 실패:', error.response?.data || error.message);
        res.status(500).json({
            message: '카카오 로그인 실패',
            error: error.response?.data || error.message,
        });
    }
};
export { signUp, login, kakao };
