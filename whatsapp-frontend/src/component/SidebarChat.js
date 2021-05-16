import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "../static/css/sidebarChat.css";


function SidebarChat({ messages }) {

  const [seed, setSeed] = useState("");


  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);
  
  return (
      <div className="sidebarChat">
      <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
      <div className="sidebarChat__info">
        <h2>Sample Chat</h2>
        <p>{messages[messages.length - 1]?.message}</p>
      </div>
    </div>
  );
}

export default SidebarChat;
