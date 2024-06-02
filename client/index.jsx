import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatApp from './app.jsx';
import './styles.css';
import { socket } from './api'; // Socket.IO 클라이언트 가져오기

// 소켓 연결 설정
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('message', (message) => {
    console.log('New message:', message);
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<ChatApp />);
