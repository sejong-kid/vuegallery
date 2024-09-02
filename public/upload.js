const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// 파일이 저장될 디렉토리 설정
const uploadDirectory = 'uploads/';

// 디렉토리가 존재하지 않으면 생성
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Multer를 사용해 파일 저장 설정
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// 정적 파일 제공
app.use('/uploads', express.static(path.join(__dirname, uploadDirectory)));

// 파일 업로드 엔드포인트
app.post('/upload', upload.single('photo'), (req, res) => {
    res.status(200).send({
        message: 'File uploaded successfully',
        fileUrl: `/uploads/${req.file.filename}` // 파일 접근 경로 반환
    });
});

// 사진 리스트를 반환하는 엔드포인트
app.get('/photos', (req, res) => {
    fs.readdir(uploadDirectory, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory');
        }
        // 파일 URL 리스트 반환
        const fileUrls = files.map(file => `/uploads/${file}`);
        res.status(200).json(fileUrls);
    });
});

// 서버 시작
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});