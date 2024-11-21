import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const usersFilePath = path.join(__dirname, '../users.json'); // 사용자 JSON 파일 경로

// 사용자 데이터 로드 함수
function loadUsersModel() {
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
}

// 사용자 데이터 저장 함수
function saveUsersModel(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

function findUserByEmailModel(email) {
    const users = loadUsersModel();
    return users.find(user => user.email === email);
}

function findUserByUserIdModel(user_id) {
    const users = loadUsersModel();
    return users.find(user => user.user_id === user_id);
}

// 마지막 user_id를 가져와서 1 증가시키는 함수
function generateUserIdModel() {
    const users = loadUsersModel();
    const lastUser = users[users.length - 1];
    return lastUser ? lastUser.user_id + 1 : 1; // 첫 번째 사용자는 1로 설정
}

function addUserModel(user) {
    const users = loadUsersModel();
    users.push(user);
    saveUsersModel(users);
}

// 사용자 프로필 업데이트 함수
function updateProfileModel(user_id, nickname, profileImage, imageFlag) {
    const users = loadUsersModel();

    // 사용자를 찾기
    const userIndex = users.findIndex(user => user.user_id === user_id);
    // 사용자 정보 업데이트
    users[userIndex].nickname = nickname;
    if(imageFlag == 1) {
        users[userIndex].profileImage = profileImage;
    }
    // 업데이트된 사용자 목록을 저장
    saveUsersModel(users);
}

// 사용자 비밀번호 업데이트 함수
function updatePasswordModel(user_id, newPassword){
    const users = loadUsersModel();

    // 사용자를 찾기
    const userIndex = users.findIndex(user => user.user_id === user_id);
    // 비밀번호 업데이트
    users[userIndex].password = newPassword;

    // 업데이트된 사용자 목록을 저장
    saveUsersModel(users);
}

function deleteUserModel(user_id) {
    const users = loadUsersModel();
    const userIndex = users.findIndex(user => user.user_id === user_id);

    // 해당 사용자 삭제
    users.splice(userIndex, 1);

    // 삭제된 후, 변경된 사용자 목록을 파일에 저장
    saveUsersModel(users);
}

export {
    loadUsersModel,
    findUserByUserIdModel,
    addUserModel,
    updateProfileModel,
    updatePasswordModel,
    deleteUserModel,
    generateUserIdModel,
    findUserByEmailModel
};
