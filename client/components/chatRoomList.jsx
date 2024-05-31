import React, { useState } from 'react';
import { searchChatRoom, createChatRoom } from '../api'; // API 호출 함수 import
import '../styles/ChatRoomList.css';

const ChatRoomList = ({ onSelectRoom }) => {
    const [roomName, setRoomName] = useState('');
    const [chatRooms, setChatRooms] = useState([]);
    const [error, setError] = useState('');
    const [roomNotFound, setRoomNotFound] = useState(false);

    const handleSearch = async () => {
        const response = await searchChatRoom(roomName);
        if (response.error) {
            setError(response.error);
            setRoomNotFound(true);
            setChatRooms([]);
        } else {
            setError('');
            setRoomNotFound(false);
            setChatRooms([response]); // 목록에 검색된 채팅방 하나만 유지
        }
    };

    const handleCreate = async () => {
        const response = await createChatRoom(roomName);
        if (response.error) {
            setError(response.error);
        } else {
            setError('');
            setRoomNotFound(false);
            setChatRooms([{ roomName }]); // 목록에 생성된 채팅방 하나만 유지
        }
    };

    return (
        <div className='chat-room-list'>
            <div className='search-create-container'>
                <input
                    placeholder='채팅방 이름 입력'
                    onChange={(e) => setRoomName(e.target.value)}
                    value={roomName}
                />
                <button onClick={handleSearch}>채팅방 검색</button>
            </div>
            {error && <p className="error-message">{error}</p>}
            {roomNotFound && (
                <div className="room-not-found">
                    <p>채팅방이 존재하지 않습니다.</p>
                    <button onClick={handleCreate}>채팅방을 생성하시겠습니까?</button>
                </div>
            )}
            <ul>
                {chatRooms.map((room, index) => (
                    <li key={index} onClick={() => onSelectRoom(room.roomName)}>
                        {room.roomName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatRoomList;
