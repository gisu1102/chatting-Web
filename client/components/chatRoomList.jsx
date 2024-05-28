import React, { useState, useEffect } from 'react';
import { searchChatRoom, createChatRoom } from '../api.js';
import '../styles/ChatRoomList.css';

const ChatRoomList = ({ onSelectRoom }) => {
    const [roomName, setRoomName] = useState('');
    const [chatRooms, setChatRooms] = useState([]);
    const [searchResult, setSearchResult] = useState(null); // 검색 결과 상태를 초기화
    const [error, setError] = useState('');

    const fetchChatRooms = async () => {
        // 여기에서 서버로부터 채팅방 목록을 가져오는 로직을 추가할 수 있습니다.
        // 예를 들어, const rooms = await getChatRooms();
        // setChatRooms(rooms);
    };

    useEffect(() => {
        fetchChatRooms();
    }, []);

    const handleSearch = async () => {
        const result = await searchChatRoom(roomName);
        if (result.error) {
            setError(result.error);
            setSearchResult([]); // 검색 결과가 없음을 나타내기 위해 빈 배열로 설정
        } else {
            setError('');
            setSearchResult(result.length > 0 ? result : []); // 결과가 있으면 설정, 없으면 빈 배열로 설정
        }
    };

    const handleCreate = async () => {
        const result = await createChatRoom(roomName);
        if (result.error) {
            setError(result.error);
        } else {
            setError('');
            if (!chatRooms.includes(roomName)) {
                setChatRooms([...chatRooms, roomName]);
            }
            setSearchResult(null); // 검색 결과를 초기화
        }
    };

    return (
        <div className='chat-room-list'>
            <div className="input-group">
                <input
                    placeholder='채팅방 이름 입력'
                    onChange={(e) => setRoomName(e.target.value)}
                    value={roomName}
                />
                <button onClick={handleSearch} className="search-button">검색</button>
            </div>
            {searchResult === null ? null : searchResult.length === 0 ? (
                <div className="no-result">
                    <p>현재 일치하는 채팅방이 없습니다.</p>
                    <button onClick={handleCreate} className="create-button">채팅방 생성하기</button>
                </div>
            ) : (
                <ul>
                    {searchResult.map((room, index) => (
                        <li key={index} onClick={() => onSelectRoom(room)}>
                            {room}
                        </li>
                    ))}
                </ul>
            )}
            <ul className="chat-rooms">
                {chatRooms.map((room, index) => (
                    <li key={index} onClick={() => onSelectRoom(room)}>
                        {room}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatRoomList;
