import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ onLogoClick, onUserInfoClick , onParticipantsClick}) => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo" onClick={onUserInfoClick}>
                <span role="img" aria-label="user" style={{fontSize: '24px'}}>👤</span>
            </div>
            <div className="sidebar-logo" onClick={onLogoClick}>
                <span role="img" aria-label="chat" style={{fontSize: '24px'}}>💬</span>
            </div>
        </div>
    );
};

export default Sidebar;
