const io = require('socket.io')();
const { joinChatRoom, sendMessage } = require('./handlers');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

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
