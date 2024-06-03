import React, { useState } from 'react';
import ChatRoomList from './ChatRoomList.jsx';
import ChatRoom from './ChatRoom.jsx';
import Sidebar from './Sidebar.jsx';
import '../styles/Chat.css';
import Header from './Header';

const Chat = ({ user }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [reset, setReset] = useState(false);

    const handleSelectRoom = (roomName) => {
        setSelectedRoom(roomName);
    };

    const handleLogoClick = () => {
        setSelectedRoom(null);
        setReset(true);
        setTimeout(() => setReset(false), 0); // Trigger a reset in ChatRoomList
    };

    const handleUserInfoClick = () => {
        alert(`현재 로그인 한 사용자: ${user}`);
    };

    return (
        <div className='chat'>
            <div className='chat-header-container'>
                <Header />
            </div>
            <div className='chat-body'>
                <div className='chat-sidebar'>
                    <Sidebar
                        onLogoClick={handleLogoClick}
                        onUserInfoClick={handleUserInfoClick}
                        onParticipantsClick={() => {}}
                    />
                </div>
                <div className='chat-content'>
                    <div className='chat-room-list-container'>
                        <ChatRoomList
                            onSelectRoom={handleSelectRoom}
                            reset={reset}
                        />
                    </div>
                    <div className='chat-room-container'>
                        {selectedRoom ? (
                            <ChatRoom roomName={selectedRoom} user={user} />
                        ) : (
                            <p>채팅방을 선택하거나 생성하세요</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
