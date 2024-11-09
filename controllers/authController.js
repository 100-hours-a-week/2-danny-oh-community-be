const userModel = require('../models/userModel');

const signUp = (req, res) => {
    const { email, password, nickname } = req.body;
    const profileImage = req.file ? req.file.path : null;

    if (userModel.findUserByEmail(email)) {
        return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    const newUser = { email, password, nickname, profileImage, role: 'user' };
    userModel.addUser(newUser);

    res.json({ message: '회원가입 성공!' });
};

const login = (req, res) => {
    const { email, password } = req.body;
    const user = userModel.loadUsers().find(user => user.email === email && user.password === password);

    if (!user) {
        return res.status(400).json({ message: '잘못된 이메일 또는 비밀번호입니다.' });
    }

    req.session.user = { email, role: user.role };
    res.json({ message: '로그인 성공!' });
};

module.exports = { signUp, login };
