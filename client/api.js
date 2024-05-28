import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

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
