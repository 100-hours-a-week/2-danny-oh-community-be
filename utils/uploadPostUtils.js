import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import s3 from './s3Client.js';

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME,
        key: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `postImages/${uniqueSuffix}${path.extname(file.originalname)}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('이미지 파일이 아님'), false);
        }
    },
});

export default upload;