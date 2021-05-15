import { Avatar } from '@material-ui/core';
import React from 'react'
import "../static/css/sidebarChat.css";
function SidebarChat() {
    return (
        <div className="sidebarChat">
            <Avatar/>
            <div className="sidebarChat__info">
                <h2>User name</h2>
                <p>This is a message</p>
            </div>
        </div>
    )
}

export default SidebarChat
