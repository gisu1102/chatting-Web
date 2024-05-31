import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ onLogoClick, onUserInfoClick }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo" onClick={onUserInfoClick}>
                사용자 정보
            </div>
            <div className="sidebar-logo" onClick={onLogoClick}>
                채팅
            </div>
        </div>
    );
};

export default Sidebar;
