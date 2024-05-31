import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../styles/ChatRoom.css';

const socket = io.connect();

const ChatRoom = ({ roomName, user, messages: initialMessages }) => {
    const [messages, setMessages] = useState(initialMessages || []);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.emit('join', { room: roomName, user }, (chatHistory) => {
            setMessages(chatHistory);
        });

        const handleMessage = (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.off('message');  // 기존 리스너 제거
        socket.on('message', handleMessage);  // 새로운 리스너 등록

        return () => {
            socket.emit('leave', { room: roomName, user });
            socket.off('message', handleMessage);  // 메시지 리스너 해제
        };
    }, [roomName, user]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('sendMessage', { room: roomName, user, text: message }, (response) => {
                setMessages((prevMessages) => [...prevMessages, response]);
            });
            setMessage('');
        }
    };

    return (
        <div className='chat-room'>
            <h2>{roomName}</h2>
            <div className='messages'>
                {messages.map((msg, i) => (
                    <div key={i} className={`message-container ${msg.username === user ? 'right' : 'left'}`}>
                        <div className={`message ${msg.username === user ? 'message-right' : 'message-left'}`}>
                            <strong>{msg.username}</strong>: {msg.message}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
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
