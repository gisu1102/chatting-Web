const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const db = require('./db'); // DB 모듈 추가

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const socketHandler = require('./routes/socket');
socketHandler(io); // 함수로 호출하여 io 객체를 전달

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // JSON 파싱 미들웨어 추가

app.set('port', 3000);

// 회원가입 엔드포인트
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    const stmt = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);
    stmt.run(username, password, function(err) {
        if (err) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        res.status(201).json({ message: 'User registered successfully' });
        stmt.finalize();
    });
});

// 로그인 엔드포인트
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err || !row) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        res.status(200).json({ message: 'User logged in successfully' });
    });
});

// 채팅방 검색 엔드포인트
app.get('/api/chatrooms/:roomName', (req, res) => {
    const { roomName } = req.params;
    db.get(`SELECT * FROM chatRooms WHERE roomName = ?`, [roomName], (err, room) => {
        if (err || !room) {
            return res.status(404).json({ message: 'Chat room not found' });
        }
        db.all(`SELECT * FROM messages WHERE roomName = ? ORDER BY timestamp ASC`, [roomName], (err, messages) => {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving messages' });
            }
            const recentMessage = messages.length > 0 ? messages[messages.length - 1].message : '최근 메시지가 없습니다.';
            res.status(200).json({ room, messages, recentMessage });
        });
    });
});

// 채팅방 목록 가져오기 엔드포인트 추가
app.get('/api/chatrooms', (req, res) => {
    db.all(`SELECT * FROM chatRooms`, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving chat rooms' });
        }
        res.status(200).json(rows);
    });
});

// 채팅방 생성 엔드포인트
app.post('/api/chatrooms', (req, res) => {
    const { roomName } = req.body;
    const stmt = db.prepare(`INSERT INTO chatRooms (roomName) VALUES (?)`);
    stmt.run(roomName, function(err) {
        if (err) {
            return res.status(400).json({ message: 'Chat room already exists' });
        }
        res.status(201).json({ message: 'Chat room created successfully' });
        stmt.finalize();
    });
});

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
