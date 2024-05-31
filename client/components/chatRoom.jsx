import React, { useState, useEffect } from 'react';
import { joinRoom, leaveRoom, sendMessage, onMessageReceived, offMessageReceived } from '../api';
import '../styles/ChatRoom.css';

const ChatRoom = ({ roomName, user }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        joinRoom(roomName, user, (chatHistory) => {
            setMessages(chatHistory);
        });

        const handleMessage = (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        onMessageReceived(handleMessage);

        return () => {
            leaveRoom(roomName, user);
            offMessageReceived(handleMessage);
        };
    }, [roomName, user]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (message) {
            await sendMessage(roomName, user, message);
            setMessage(''); // 메시지를 비운다
        }
    };

    return (
        <div className='chat-room'>
            <h2>{roomName}</h2>
            <div className='messages'>
                {messages.map((msg, i) => (
                    <div key={i} className={`message-container ${msg.username === user ? 'right' : 'left'}`}>
                        <div className={`message ${msg.username === user ? 'message-right' : 'message-left'}`}>
                            <strong>{msg.username}</strong>
                            <div>{msg.message}</div>
                        </div>
                        <div className={`timestamp ${msg.username === user ? 'left' : 'right'}`}>
                            {new Date(msg.timestamp).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'medium' })}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    type='text'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='메시지 입력'
                />
                <button type='submit'>보내기</button>
            </form>
        </div>
    );
};

export default ChatRoom;
