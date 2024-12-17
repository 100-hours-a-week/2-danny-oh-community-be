FROM node
WORKDIR /app

# 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사
COPY . ./

# 실행
CMD ["node", "app.js"]