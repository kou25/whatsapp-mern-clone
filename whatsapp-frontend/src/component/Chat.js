import { Avatar, IconButton } from "@material-ui/core";
import {
  AttachFile,
  InsertEmoticon,
  MoreVert,
  SearchOutlined,
} from "@material-ui/icons";
import MicIcon from "@material-ui/icons/Mic";
import React, { useState, useEffect} from "react";
import "../static/css/chat.css";
import Axios from "../Axios";
import { useStateValue } from "../StateProvider";
import {
  useParams,
} from "react-router-dom";
import Pusher from "pusher-js";
import moment from 'moment'
import { Modal, Popover, message } from "antd";
import { useHistory } from 'react-router-dom';



function Chat() {
  const history = useHistory();
  const [{user},dispatch] = useStateValue()
  const [input, setInput] = useState("");
  const [room, setRoom] = useState({});
  const [messages, setMessages] = useState([]);
  const {roomID} = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
  const redirect =window.location.hostname
  Axios.delete("/room?_id="+roomID+'&username='+user?.displayName).then((response) => {
      message.success('Successfully deleted')
      setIsModalVisible(false);
      //will work only on hosted url not localhost
      window.location.replace(redirect)
    }
    )
    .catch((err) => {
      message.error('Error while deleting')
  });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const content = (
    <div className='sidebar__popover'>
      <p onClick={showModal}>Delete this Room</p>
      <Modal title="Delete Room" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Are you sure you want to delete this room ?</p>
      </Modal>
    </div>
  );

  useEffect(() => {
    Axios.get("/room?_id="+roomID).then((response) => {
      setRoom(response.data.rooms);
    });
  }, [roomID]);

  useEffect(() => {
    Axios.get("/messages/sync?room_id="+roomID).then((response) => {
      setMessages(response.data.messages);
    });
  }, [roomID]);

  useEffect(() => {
    const pusher = new Pusher("5be31c0d421971904201", {
      cluster: "ap2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessages) => {
      setMessages([...messages, newMessages]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    await Axios.post("/message/new", {
      message: input,
      name: user?.displayName,
      timestamp: moment(new Date()).unix(),
      received: true,
      room_id: roomID
    });

    setInput('')
  };

  const SetTime=(dateTimeStamp)=>{
    if(dateTimeStamp!==undefined){
    let currentDate  = moment().format('llll');
    let oldDate = moment.unix(dateTimeStamp).format('llll');
    let diff = moment(currentDate).diff(moment(oldDate), 'minutes'); //diff  in minutes 
    let date = 'Just Now';

    
    if((diff > 1) && (diff < 1440)){
      date = moment.unix(dateTimeStamp).fromNow(); // return date in hour or minutes if diff is greater then 1 min and less the 24 hourss
    }
    else if(diff > 1439){
       date = moment.unix(dateTimeStamp).format('D MMMM, hh:mm'); // return date in datetime if diff is greater then 1 day
    }    
    else{
      date =  'Just Now'; // return if diff is less then 1 min
    }
    return date
  }
  }
  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={room?.image}/>

        <div className="chat__headerInfo">
          <h3>{room?.name}</h3>
          <p> {SetTime(messages[messages.length - 1]?.timestamp)==='Just Now' ? 'Active' : `Last seen  ${SetTime(messages[messages.length - 1]?.timestamp)}`}</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <Popover content={content} trigger="click">
          <IconButton>
            <MoreVert />
          </IconButton>
          </Popover>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={
              message.name!==user.displayName
                ? "chat__message"
                : "chat__message chat__reciever"
            }
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">{SetTime(message.timestamp)}</span>
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <InsertEmoticon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <MicIcon />
      </div>
    </div>
  );
}

export default Chat;
