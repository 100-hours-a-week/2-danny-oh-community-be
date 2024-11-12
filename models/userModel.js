const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../users.json');

// 사용자 데이터 로드 함수
function loadUsers() {
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
}

// 사용자 데이터 저장 함수
function saveUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

function findUserByEmail(email) {
    const users = loadUsers();
    return users.find(user => user.email === email);
}

function findUserByUserId(user_id) {
    const users = loadUsers();
    return users.find(user => user.user_id === user_id);
}

// 마지막 user_id를 가져와서 1 증가시키는 함수
function generateUserId() {
    const users = loadUsers();
    const lastUser = users[users.length - 1];
    return lastUser ? lastUser.user_id + 1 : 1; // 첫 번째 사용자는 1로 설정
}

function addUser(user) {
    const users = loadUsers();
    user.user_id = generateUserId(); // user_id 생성
    users.push(user);
    saveUsers(users);
}

// 사용자 프로필 업데이트 함수
function updateProfile(user_id, nickname, profileImage) {
    const users = loadUsers();

    // 사용자를 찾기
    const userIndex = users.findIndex(user => user.user_id === user_id);

    // 사용자 정보 업데이트
    users[userIndex].nickname = nickname;
    users[userIndex].profileImage = profileImage;

    // 업데이트된 사용자 목록을 저장
    saveUsers(users);
}

// 사용자 비밀번호 업데이트 함수
function updatePassword(user_id, newPassword){
    const users = loadUsers();

    // 사용자를 찾기
    const userIndex = users.findIndex(user => user.user_id === user_id);
    // 비밀번호 업데이트
    users[userIndex].password = newPassword;

    // 업데이트된 사용자 목록을 저장
    saveUsers(users);
}

function deleteUser(user_id) {
    const users = loadUsers();
    const userIndex = users.findIndex(user => user.user_id === user_id);

    // 해당 사용자 삭제
    users.splice(userIndex, 1);

    // 삭제된 후, 변경된 사용자 목록을 파일에 저장
    saveUsers(users);
}

module.exports = {
    loadUsers,
    saveUsers,
    findUserByUserId,
    addUser,
    updateProfile,
    updatePassword,
    deleteUser,
    generateUserId,
    findUserByEmail
};
