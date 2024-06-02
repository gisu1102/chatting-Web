import axios from 'axios';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:3000/api';
const socket = io.connect();

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

export const onMessageReceived = (callback) => {
    socket.on('message', callback);
};

export const offMessageReceived = (callback) => {
    socket.off('message', callback);
};