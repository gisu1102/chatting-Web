import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../styles/ChatRoomList.css';

const socket = io.connect();

const ChatRoomList = ({ onSelectRoom }) => {
    const [roomName, setRoomName] = useState('');
    const [chatRooms, setChatRooms] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('login', {}, (response) => {
                if (response.error) {
                    setError(response.error);
                } else {
                    setChatRooms(response.chatRooms);
                }
            });
        });

        return () => {
            socket.off('connect');
        };
    }, []);

    const handleSearch = () => {
        socket.emit('searchChatRoom', roomName, (response) => {
            if (response.error) {
                setError(response.error);
            } else {
                setError('');
                onSelectRoom(response.room, response.messages);
            }
        });
    };

    const handleCreate = () => {
        socket.emit('createChatRoom', roomName, (response) => {
            if (response.error) {
                setError(response.error);
            } else {
                setError('');
                setChatRooms([...chatRooms, { roomName }]);
                onSelectRoom(roomName, []);
            }
        });
    };

    return (
        <div className='chat-room-list'>
            <input
                placeholder='채팅방 이름 입력'
                onChange={(e) => setRoomName(e.target.value)}
                value={roomName}
            />
            <button onClick={handleSearch}>채팅방 검색</button>
            {error && <p>{error}</p>}
            <button onClick={handleCreate}>채팅방 생성</button>
            <ul>
                {chatRooms.map((room, index) => (
                    <li key={index} onClick={() => onSelectRoom(room.roomName, room.messages)}>
                        {room.roomName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatRoomList;
