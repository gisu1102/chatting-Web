const io = require('socket.io')();
const db = require('../db');
const { registerUser, loginUser, searchChatRoom, createChatRoom,joinChatRoom, sendMessage } = require('./handlers');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('register', (data, callback) => {
      registerUser(data.username, data.password, (err, message) => {
        if (err) {
          return callback({ error: err });
        }
        callback({ message });
      });
    });

    socket.on('login', (data, callback) => {
      loginUser(data.username, data.password, (err, message) => {
        if (err) {
          return callback({ error: err });
        }
        callback({ message });
      });
    });

    socket.on('searchChatRoom', (roomName, callback) => {
      searchChatRoom(roomName, (err, room) => {
        if (err) {
          return callback({ error: err });
        }
        callback(room);
      });
    });

    socket.on('createChatRoom', (roomName, callback) => {
      createChatRoom(roomName, (err, message) => {
        if (err) {
          return callback({ error: err });
        }
        callback({ message });
      });
    });

    socket.on('join', ({ room, user }, callback) => {
      socket.join(room);
      joinChatRoom(room, user, (err, rows) => {
        if (err) {
          return callback(err);
        }
        callback(rows);
      });
    });

    socket.on('sendMessage', ({ room, user, text }, callback) => {
      sendMessage(room, user, text, (err, message) => {
        if (err) {
          return callback(err);
        }
        io.to(room).emit('message', message);
        callback(message);
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};