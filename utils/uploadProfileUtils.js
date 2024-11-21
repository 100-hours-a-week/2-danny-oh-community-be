import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer 스토리지 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads/profileImages');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // 랜덤 파일명 생성
        const randomName = crypto.randomBytes(16).toString('hex');
        const extension = path.extname(file.originalname);
        cb(null, `${randomName}${extension}`);
    },
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('이미지 파일만 업로드 가능합니다.'));
};

// Multer 인스턴스 생성
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter,
}).single('profileImage');

// 파일 업로드 함수
export const uploadProfileImage = (req) =>
    new Promise((resolve, reject) => {
        upload(req, null, (err) => {
            if (err) {
                return reject(err); // 업로드 에러 처리
            }
            if (!req.file) {
                return reject(new Error('파일이 업로드되지 않았습니다.'));
            }
            resolve(req.file.filename); // 업로드된 파일명 반환
        });
    });
