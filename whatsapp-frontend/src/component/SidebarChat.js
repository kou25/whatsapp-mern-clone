import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import{Link} from 'react-router-dom'
import "../static/css/sidebarChat.css";
import axios from "../Axios";

function SidebarChat({room }) {

  const [lastMessage, SetLastMessage] = useState("");

  const fetchLastMessage=(id)=>{
    axios.get("/messages/sync?room_id="+id).then((response) => {
    let messages =response.data.messages
    SetLastMessage(messages[messages.length - 1]?.message)
    console.log(messages[messages.length - 1]?.message,'mes')
  })
  }
  useEffect(() => {
    fetchLastMessage(room._id)
  }, []);
  

  return (
    <Link to={"/room/"+room._id}>
      <div className="sidebarChat">
      <Avatar src={room.image} />
      <div className="sidebarChat__info">
        <h2>{room.name}</h2>
        <p>{lastMessage}</p>
      </div>
    </div>
    </Link>
  );
}

export default SidebarChat;
