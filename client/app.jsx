import React, { useState } from 'react';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Chat from './components/Chat.jsx';

const ChatApp = () => {
	const [user, setUser] = useState(null);
	const [isRegistered, setIsRegistered] = useState(false);

	const handleLogin = (username) => {
		setUser(username);
	};

	const handleRegister = () => {
		setIsRegistered(true);
	};

	if (user) {
		return <Chat user={user} />;
	}

	if (!isRegistered) {
		return <Register onRegister={handleRegister} />;
	}

	return <Login onLogin={handleLogin} />;
};

export default ChatApp;
