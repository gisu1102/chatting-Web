import axios from 'axios';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:3000/api';
export const socket = io.connect();

export const register = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, { username, password });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message };
    }
};

export const login = async (username, password) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message };
    }
};

export const searchChatRoom = async (roomName) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chatrooms/${roomName}`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.message };
    }
};

export const createChatRoom = async (roomName) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chatrooms`, { roomName });
        return response.data;
    } catch (error) {
        return { error: error.response.data.message };
    }
};

export const getAllChatRooms = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chatrooms`);
        return response.data;
    } catch (error) {
        return { error: error.response.data.message };
    }
};

// WebSocket 관련 API 로직
export const joinRoom = (roomName, user, callback) => {
    socket.emit('join', { room: roomName, user }, callback);
};

export const leaveRoom = (roomName, user) => {
    socket.emit('leave', { room: roomName, user });
};

export const sendMessage = (roomName, user, text) => {
    return new Promise((resolve) => {
        const messageData = { room: roomName, user, text };
        socket.emit('sendMessage', messageData, (response) => {
            resolve(response);
        });
    });
};

// 클라이언트 측에서 수신되는 메세지 처리 - socket listener 등록
export const onMessageReceived = (callback) => {
    socket.on('message', callback);
};

export const offMessageReceived = (callback) => {
    socket.off('message', callback);
};

export const onChatRoomCreated = (callback) => {
    socket.on('chatRoomCreated', callback);
};

export const offChatRoomCreated = (callback) => {
    socket.off('chatRoomCreated', callback);
};

export const onChatRoomJoined = (callback) => {
    socket.on('chatRoomJoined', callback);
};

export const offChatRoomJoined = (callback) => {
    socket.off('chatRoomJoined', callback);
};
