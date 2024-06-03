/*
socket event handlers -> 여기서 socket event 처리
app.js(server) db 처리 query문 여기다
 */

const db = require('../db');

const registerUser = (username, password, callback) => {
    const stmt = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);
    stmt.run(username, password, function(err) {
        if (err) {
            return callback('Username already exists');
        }
        callback(null, 'User registered successfully');
        stmt.finalize();
    });
};

const loginUser = (username, password, callback) => {
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password], (err, row) => {
        if (err || !row) {
            return callback('Invalid username or password');
        }
        callback(null, 'User logged in successfully');
    });
};

const searchChatRoom = (roomName, callback) => {
    db.get(`SELECT * FROM chatRooms WHERE roomName = ?`, [roomName], (err, row) => {
        if (err || !row) {
            return callback('Chat room not found');
        }
        db.all(`SELECT * FROM messages WHERE roomName = ? ORDER BY timestamp ASC`, [roomName], (err, rows) => {
            if (err) {
                return callback('Could not retrieve messages');
            }
            callback(null, { room: row, messages: rows });
        });
    });
};

const createChatRoom = (roomName, callback) => {
    const stmt = db.prepare(`INSERT INTO chatRooms (roomName) VALUES (?)`);
    stmt.run(roomName, function(err) {
        if (err) {
            return callback('Chat room already exists');
        }
        callback(null, 'Chat room created successfully');
        stmt.finalize();
    });
};


const getAllChatRooms = (callback) => {
    db.all(`SELECT * FROM chatRooms`, (err, rows) => {
        if (err) {
            return callback('Error retrieving chat rooms');
        }
        callback(null, rows);
    });
};

const joinChatRoom = (room, user, callback) => {
    db.all(`SELECT * FROM messages WHERE roomName = ? ORDER BY timestamp ASC`, [room], (err, rows) => {
        if (err) {
            return callback({ error: 'Could not retrieve messages' });
        }
        callback(null, rows);
    });
};

const sendMessage = (room, user, text, callback) => {
    const stmt = db.prepare(`INSERT INTO messages (roomName, username, message) VALUES (?, ?, ?)`);
    stmt.run(room, user, text, function(err) {
        if (err) {
            return callback({ error: 'Could not send message' });
        }
        const message = { roomName: room, username: user, message: text, timestamp: new Date() };
        callback(null, message);
    });
    stmt.finalize();
};

module.exports = {
    registerUser,
    loginUser,
    searchChatRoom,
    createChatRoom,
    joinChatRoom,
    sendMessage,
    getAllChatRooms
};
