import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3 from './s3Client.js';

/**
 * S3에서 파일 삭제
 * @param {string} fileKey - 삭제할 파일의 키 (S3 버킷 내 경로)
 * @returns {Promise<void>}
 */
const deleteFile = async (fileKey) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME, // S3 버킷 이름
        Key: fileKey, // 삭제할 파일의 키
    };

    try {
        const command = new DeleteObjectCommand(params);
        await s3.send(command); // S3Client의 send 메서드로 명령 실행
        console.log(`파일 삭제 성공: ${fileKey}`);
    } catch (error) {
        console.error(`파일 삭제 실패: ${fileKey}`, error);
        throw new Error('파일 삭제 중 오류 발생');
    }
};

export default deleteFile;