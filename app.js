const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { registerUser, loginUser, searchChatRoom, createChatRoom, getAllChatRooms } = require('./routes/handlers');
const socketHandler = require('./routes/socket');
socketHandler(io);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.set('port', 3000);

app.post('/api/register', (req, res) => {
    registerUser(req.body.username, req.body.password, (err, message) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        res.status(201).json({ message });
    });
});

app.post('/api/login', (req, res) => {
    loginUser(req.body.username, req.body.password, (err, message) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        res.status(200).json({ message });
    });
});

app.get('/api/chatrooms/:roomName', (req, res) => {
    searchChatRoom(req.params.roomName, (err, room) => {
        if (err) {
            return res.status(404).json({ message: err });
        }
        res.status(200).json(room);
    });
});




app.get('/api/chatrooms', (req, res) => {
    getAllChatRooms((err, rooms) => {
        if (err) {
            return res.status(500).json({ message: err });
        }
        res.status(200).json(rooms);
    });
});
app.post('/api/chatrooms', (req, res) => {
    createChatRoom(req.body.roomName, (err, message) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        res.status(201).json({ message });
    });
});

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
