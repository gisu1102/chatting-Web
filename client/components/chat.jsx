import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { searchChatRoom, createChatRoom } from '../api.js';

const socket = io.connect();

const UsersList = ({ users }) => (
    <div className='users'>
        <h3> 참여자들 </h3>
        <ul>
            {users.map((user, i) => (
                <li key={i}>
                    {user}
                </li>
            ))}
        </ul>
    </div>
);

const Message = ({ user, text }) => (
    <div className="message">
        <strong>{user} :</strong>
        <span>{text}</span>
    </div>
);

const MessageList = ({ messages }) => (
    <div className='messages'>
        <h2> 채팅방 </h2>
        {messages.map((message, i) => (
            <Message key={i} user={message.user} text={message.text} />
        ))}
    </div>
);

const MessageForm = ({ user, onMessageSubmit }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const message = { user, text };
        onMessageSubmit(message);
        setText('');
    };

    return (
        <div className='message_form'>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder='메시지 입력'
                    className='textinput'
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                />
                <h3></h3>
            </form>
        </div>
    );
};

const ChangeNameForm = ({ onChangeName }) => {
    const [newName, setNewName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onChangeName(newName);
        setNewName('');
    };

    return (
        <div className='change_name_form'>
            <h3> 아이디 변경 </h3>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder='변경할 아이디 입력'
                    onChange={(e) => setNewName(e.target.value)}
                    value={newName}
                />
            </form>
        </div>
    );
};

const Chat = ({ user }) => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState('');
    const [chatRoom, setChatRoom] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (chatRoom) {
            socket.on('init', _initialize);
            socket.on('send:message', _messageRecieve);
            socket.on('user:join', _userJoined);
            socket.on('user:left', _userLeft);
            socket.on('change:name', _userChangedName);

            return () => {
                socket.off('init', _initialize);
                socket.off('send:message', _messageRecieve);
                socket.off('user:join', _userJoined);
                socket.off('user:left', _userLeft);
                socket.off('change:name', _userChangedName);
            };
        }
    }, [chatRoom]);

    const _initialize = (data) => {
        const { users, messages } = data;
        setUsers(users);
        setMessages(messages);
    };

    const _messageRecieve = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const _userJoined = (data) => {
        setUsers((prevUsers) => [...prevUsers, data.name]);
    };

    const _userLeft = (data) => {
        setUsers((prevUsers) => prevUsers.filter((user) => user !== data.name));
    };

    const _userChangedName = (data) => {
        const { oldName, newName } = data;
        setUsers((prevUsers) =>
            prevUsers.map((name) => (name === oldName ? newName : name))
        );
    };

    const handleMessageSubmit = (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        socket.emit('send:message', message);
    };

    const handleChangeName = (newName) => {
        const oldName = user;
        socket.emit('change:name', { name: newName }, (result) => {
            if (!result) {
                return alert('There was an error changing your name');
            }
            setUsers((prevUsers) =>
                prevUsers.map((name) => (name === oldName ? newName : name))
            );
        });
    };

    const handleRoomSearch = async () => {
        const result = await searchChatRoom(room);
        if (result.error) {
            setError(result.error);
        } else {
            setError('');
            setChatRoom(room);
            socket.emit('join:room', { room, user });
        }
    };

    const handleRoomCreate = async () => {
        const result = await createChatRoom(room);
        if (result.error) {
            setError(result.error);
        } else {
            setError('');
            setChatRoom(room);
            socket.emit('join:room', { room, user });
        }
    };

    if (!chatRoom) {
        return (
            <div className='room_search'>
                <input
                    placeholder='채팅방 이름 입력'
                    onChange={(e) => setRoom(e.target.value)}
                    value={room}
                />
                <button onClick={handleRoomSearch}>채팅방 검색</button>
                <button onClick={handleRoomCreate}>채팅방 생성</button>
                {error && <p>{error}</p>}
            </div>
        );
    }

    return (
        <div className='center'>
            <h2>{chatRoom}</h2>
            <UsersList users={users} />
            <ChangeNameForm onChangeName={handleChangeName} />
            <MessageList messages={messages} />
            <MessageForm onMessageSubmit={handleMessageSubmit} user={user} />
        </div>
    );
};

export default Chat;
