// models/userModel.js
const db = require('../db');

const getAllUsers = (callback) => {
    const sql = 'SELECT * FROM member';
    db.query(sql, (err, results) => {
        if (err) return callback(err); // 오류 처리
        callback(null, results);
    });
};

const postUser = (userData, callback) => {
    const sql = 'INSERT INTO member (email, password, nickname) VALUES (?, ?, ?)';
    const values = [userData.email, userData.password, userData.nickname]; // 사용자의 정보

    db.query(sql, values, (err, results) => {
        if (err) return callback(err); // 오류 처리
        callback(null, results); // 삽입 결과 반환
    });
};


const updateUser = (userData, callback) => {
    const sql = 'UPDATE member SET email = ?, password = ?, nickname = ? WHERE id = ?';
    const values = [userData.email, userData.password, userData.nickname, userData.id];

    db.query(sql, values, (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

const deleteUser = (id, callback) => {
    const sql = 'DELETE FROM member WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};


module.exports = { getAllUsers, postUser, updateUser, deleteUser };