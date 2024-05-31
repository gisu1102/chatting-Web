import React, { useState } from 'react';
import ChatRoom from './components/ChatRoom';
import ChatRoomList from './components/ChatRoomList';
import Login from './components/Login';
import Register from './components/Register';
import Sidebar from './components/Sidebar';
import './styles/Chat.css';

const ChatApp = () => {
	const [user, setUser] = useState(null);
	const [isRegistered, setIsRegistered] = useState(true);
	const [selectedRoom, setSelectedRoom] = useState('');
	const [messages, setMessages] = useState([]);

	const handleLogin = (username) => {
		setUser(username);
	};

	const handleRegister = () => {
		setIsRegistered(true);
	};

	const handleSelectRoom = (room, messages) => {
		setSelectedRoom(room);
		setMessages(messages);
	};

	const handleShowUserInfo = () => {
		alert(`로그인한 사용자: ${user}`);
	};

	const handleGoToHome = () => {
		setSelectedRoom('');
		setMessages([]);
	};

	if (!user) {
		return isRegistered ? <Login onLogin={handleLogin} onRegisterClick={() => setIsRegistered(false)} /> : <Register onRegister={handleRegister} />;
	}

	return (
		<div className='chat-app'>

			<div className='main-content'>
				<Sidebar onLogoClick={handleGoToHome} onUserInfoClick={handleShowUserInfo} />
				<ChatRoomList onSelectRoom={handleSelectRoom} />
				{selectedRoom && <ChatRoom roomName={selectedRoom} user={user} messages={messages} />}
			</div>

		</div>
	);
};

export default ChatApp;
