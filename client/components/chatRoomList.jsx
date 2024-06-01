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

            // 최근 메시지를 포함하도록 response를 업데이트
            const recentMessage = response.messages && response.messages.length > 0
                ? response.messages[response.messages.length - 1].message
                : '최근 메시지가 없습니다.';

            setChatRooms([{ ...response, recentMessage }]); // 목록에 검색된 채팅방 하나만 유지
        }
    };

    const handleCreate = async () => {
        const response = await createChatRoom(roomName);
        if (response.error) {
            setError(response.error);
        } else {
            setError('');
            setRoomNotFound(false);
            setChatRooms([{ roomName, recentMessage: '채팅방이 생성되었습니다.' }]); // 목록에 생성된 채팅방 하나만 유지
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
                <button onClick={handleSearch}>
                    🔍︎
                </button>
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
                        <div className='chat-room-item'>
                            <span className='icon'>🏠</span>
                            <div className='chat-room-info'>
                                <div className='room-name'>{room.roomName}</div>
                                <div className='recent-message'>{room.recentMessage}</div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatRoomList;
