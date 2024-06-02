import React from 'react';
import '../styles/TopBar.css';

const TopBar = () => {
    return (
        <div className="top-bar">
            <img src="/images/whitetiger.png" alt="Logo" className="logo" />
            <div className="top-bar-text">횃불이 채팅웹페이지 !-!</div>
        </div>
    );
};

export default TopBar;
