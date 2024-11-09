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

function addUser(user) {
    const users = loadUsers();
    users.push(user);
    saveUsers(users);
}

module.exports = {
    loadUsers,
    saveUsers,
    findUserByEmail,
    addUser
};
