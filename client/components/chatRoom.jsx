import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../styles/ChatRoom.css';

const socket = io.connect();

const ChatRoom = ({ roomName, user }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.emit('join', { room: roomName, user });

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.emit('leave', { room: roomName, user });
            socket.off();
        };
    }, [roomName, user]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            socket.emit('sendMessage', { room: roomName, user, text: message });
            setMessage('');
        }
    };

    return (
        <div className='chat-room'>
            <h2>{roomName}</h2>
            <div className='messages'>
                {messages.map((msg, i) => (
                    <div key={i}>
                        <strong>{msg.user}</strong>: {msg.text}
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
