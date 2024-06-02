import React from 'react';
import '../styles/header.css';

const Header = () => {
    return (
        <div className="chat-header">
            <img src="/images/whitetiger.png" alt="Logo" className="logo" />
            <div className="top-bar-text">횃불이 채팅웹페이지 !-!</div>
        </div>
    );
};

export default Header;
