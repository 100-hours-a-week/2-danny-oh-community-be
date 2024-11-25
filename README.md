# 2-danny-oh-community-be

커뮤니티 백엔드 코드입니다.
https://github.com/100-hours-a-week/2-danny-oh-community-fe
위 프론트엔드 환경과 같이 사용해야 합니다.


## DB 설정
.env 파일을 생성해 아래와 같이 입력하여 저장해 줍니다. (app.js 와 동일한 경로에 생성)

```
DB_HOST = '주소'
DB_USER = '유저명'
DB_PASSWORD = '비밀번호'
DB_NAME = '데이터베이스 이름'
```

아래 쿼리문을 통해 테이블을 생성해 주세요

```sql
-- 테이블 생성 SQL - member
CREATE TABLE users
(
    `user_id`     INT             NOT NULL    AUTO_INCREMENT COMMENT '회원 ID', 
    `email`       VARCHAR(100)    NOT NULL    COMMENT '이메일', 
    `password`    VARCHAR(255)    NOT NULL    COMMENT '비밀번호', 
    `image_url`   TEXT            NULL        COMMENT '프로필 이미지', 
    `nickname`    VARCHAR(100)    NOT NULL    COMMENT '닉네임', 
    `created_at`  DATETIME        NOT NULL    COMMENT '회원 생성일', 
    `updated_at`  DATETIME        NULL        COMMENT '회원 수정일', 
    `is_deleted`  BOOLEAN         NOT NULL    DEFAULT FALSE COMMENT '삭제 여부', 
     PRIMARY KEY (user_id)
);

-- 테이블 생성 SQL - posts
CREATE TABLE posts
(
    `post_id`      INT             NOT NULL    AUTO_INCREMENT COMMENT '게시글 ID', 
    `user_id`      INT             NOT NULL    COMMENT '회원 참조 키', 
    `title`        VARCHAR(100)    NOT NULL    COMMENT '글 제목', 
    `contents`     TEXT            NOT NULL    COMMENT '글 내용', 
    `photo_url`    TEXT            NULL        COMMENT '사진 URL', 
    `view_cnt`     INT             NOT NULL    DEFAULT 0 COMMENT '조회수', 
    `like_cnt`     INT             NOT NULL    DEFAULT 0 COMMENT '좋아요수', 
    `comment_cnt`  INT             NOT NULL    DEFAULT 0 COMMENT '댓글수', 
    `created_at`   DATETIME        NOT NULL    COMMENT '게시글 작성일', 
    `updated_at`   DATETIME        NULL        COMMENT '게시글 수정일', 
    `is_deleted`   BOOLEAN         NOT NULL    DEFAULT FALSE COMMENT '삭제 여부', 
     PRIMARY KEY (post_id)
);

ALTER TABLE posts
    ADD CONSTRAINT  FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE;



-- 테이블 생성 SQL - comments
CREATE TABLE comments
(
    `comment_id`  INT         NOT NULL    AUTO_INCREMENT COMMENT '댓글 ID', 
    `user_id`     INT         NOT NULL    COMMENT '회원 참조 키', 
    `post_id`     INT         NOT NULL    COMMENT '게시글 참조 키', 
    `contents`    TEXT        NOT NULL    COMMENT '댓글 내용', 
    `created_at`  DATETIME    NOT NULL    COMMENT '댓글 작성일', 
    `updated_at`  DATETIME    NULL        COMMENT '댓글 수정일', 
    `is_deleted`  BOOLEAN     NOT NULL    DEFAULT FALSE COMMENT '삭제 여부', 
     PRIMARY KEY (comment_id)
);

ALTER TABLE comments
    ADD CONSTRAINT  FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE comments
    ADD CONSTRAINT  FOREIGN KEY (post_id)
        REFERENCES posts (post_id) ON DELETE CASCADE ON UPDATE CASCADE;

```

## 실행 방법
**1. 클론 후 의존성 설치**
**2. 'node app.js' 명령어 실행**
