const io = require('socket.io')();
const db = require('../db'); // 상위 디렉토리에서 db 모듈 가져오기

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    // 회원가입
    socket.on('register', (data, callback) => {
      const { username, password } = data;
      const stmt = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);
      stmt.run(username, password, function (err) {
        if (err) {
          console.error('Error registering user:', err.message);
          return callback({ error: 'Username already exists' });
        }
        callback({ message: 'User registered successfully' });
      });
      stmt.finalize();
    });

    // 로그인
    socket.on('login', (data, callback) => {
      const { username, password } = data;
      db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err || !row) {
          console.error('Error logging in:', err ? err.message : 'Invalid username or password');
          return callback({ error: 'Invalid username or password' });
        }
        db.all(`SELECT roomName FROM chatRooms`, [], (err, rows) => {
          if (err) {
            console.error('Error retrieving chat rooms:', err.message);
            return callback({ error: 'Could not retrieve chat rooms' });
          }
          callback({ message: 'User logged in successfully', chatRooms: rows });
        });
      });
    });

    // 채팅방 검색
    socket.on('searchChatRoom', (roomName, callback) => {
      db.get(`SELECT * FROM chatRooms WHERE roomName = ?`, [roomName], (err, row) => {
        if (err || !row) {
          console.error('Error searching chat room:', err ? err.message : 'Chat room not found');
          return callback({ error: 'Chat room not found' });
        }
        db.all(`SELECT * FROM messages WHERE roomName = ? ORDER BY timestamp ASC`, [roomName], (err, rows) => {
          if (err) {
            console.error('Error retrieving messages:', err.message);
            return callback({ error: 'Could not retrieve messages' });
          }
          callback({ room: row, messages: rows });
        });
      });
    });

    // 채팅방 생성
    socket.on('createChatRoom', (roomName, callback) => {
      const stmt = db.prepare(`INSERT INTO chatRooms (roomName) VALUES (?)`);
      stmt.run(roomName, function (err) {
        if (err) {
          console.error('Error creating chat room:', err.message);
          return callback({ error: 'Chat room already exists' });
        }
        // 새 채팅방 생성 시 모든 클라이언트에게 알림
        io.emit('chatRoomCreated', { roomName });
        callback({ message: 'Chat room created successfully' });
      });
      stmt.finalize();
    });

    // 채팅방 입장
    socket.on('join', ({ room, user }, callback) => {
      socket.join(room);
      db.all(`SELECT * FROM messages WHERE roomName = ? ORDER BY timestamp ASC`, [room], (err, rows) => {
        if (err) {
          console.error('Error retrieving messages:', err.message);
          return callback({ error: 'Could not retrieve messages' });
        }
        callback(rows);
      });
      // 채팅방 참여 시 모든 클라이언트에게 알림
      io.emit('chatRoomJoined', { roomName: room, user });
    });

    // 메시지 전송
    socket.on('sendMessage', ({ room, user, text }, callback) => {
      const stmt = db.prepare(`INSERT INTO messages (roomName, username, message) VALUES (?, ?, ?)`);
      stmt.run(room, user, text, function (err) {
        if (err) {
          console.error('Error sending message:', err.message);
          return callback({ error: 'Could not send message' });
        }
        const message = { roomName: room, username: user, message: text, timestamp: new Date() };
        io.to(room).emit('message', message);
        callback(message);
      });
      stmt.finalize();
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};
