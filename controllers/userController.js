// controllers/userController.js
const { getAllUsers, postUser } = require('../models/userModel');

const getUsers = (req, res) => {
    getAllUsers((err, users) => {
        if (err) {
            return res.status(500).json({ message: '사용자 목록을 가져오는 데 오류가 발생했습니다.' });
        }
        res.json(users);
    });
};

const createUser = (req, res) => {
    postUser(req.body, (err, result) => {
        if (err) {
            return res.status(500).json({ 
                message: '사용자를 생성하는 데 오류가 발생했습니다.',
             });
        }
        res.status(201).json(result);
    });
};

const updateUser = (req, res) => {
    updateUser(req.body, (err, result) => {
        if (err) {
            return res.status(500).json({ message: '사용자 정보를 업데이트하는 데 오류가 발생했습니다.' });
        }
        res.status(200).json(result);
    });
};

const deleteUser = (req, res) => {
    deleteUser(req.params.id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: '사용자를 삭제하는 데 오류가 발생했습니다.' });
        }
        res.status(200).json(result);
    });
};

module.exports = { getUsers, createUser, updateUser, deleteUser };