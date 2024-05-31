const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('index.db');

db.serialize(() => {
    // Users 테이블 생성
    db.run(`CREATE TABLE IF NOT EXISTS users (
                                                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                 username TEXT UNIQUE,
                                                 password TEXT
            )`);

    // ChatRooms 테이블 생성
    db.run(`CREATE TABLE IF NOT EXISTS chatRooms (
                                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                     roomName TEXT UNIQUE
            )`);

    // Messages 테이블 생성
    db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    roomName TEXT,
    username TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
