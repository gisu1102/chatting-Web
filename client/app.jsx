import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat'; // Chat 컴포넌트 임포트
import './styles/Chat.css';

const ChatApp = () => {
	const [user, setUser] = useState(null);
	const [isRegistered, setIsRegistered] = useState(true);

	const handleLogin = (username) => {
		setUser(username);
	};

	const handleRegister = () => {
		setIsRegistered(true);
	};

	if (!user) {
		return isRegistered ? <Login onLogin={handleLogin} onRegisterClick={() => setIsRegistered(false)} /> : <Register onRegister={handleRegister} />;
	}

	return <Chat user={user} />;
};

export default ChatApp;
