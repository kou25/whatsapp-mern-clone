import React from "react";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "../static/css/sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import SidebarChat from "./SidebarChat";
import { useStateValue } from "../StateProvider";
import axios from "../Axios";
import { Modal, Popover } from "antd";
import { Input } from "antd";
import {
  UserOutlined,
  FileImageOutlined,
  SearchOutlined,
} from "@ant-design/icons";
function Sidebar() {
  const history = useHistory();
  const [{ user }, dispatch] = useStateValue();
  const [rooms, setRooms] = React.useState([]);
  const [nameInput, setNameInput] = React.useState('');
  const [imageInput, setImageInput] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    axios.get("/rooms").then((response) => {
      setRooms(
        response.data.map((data) => ({
          id: data._id,
          data: data,
        }))
      );
    });
  }, []);




  const handleAddNewChat = () => {
    setModalVisible(true);
  };
  const handleLogout=()=>{
    localStorage.removeItem("user")
    setModalVisible(false);
    window.location.reload();
  }
  const createNewRoom = async (e) => {
    e.preventDefault();
    if(nameInput!==''){
    await axios.post("/room/new", {
      name: nameInput,
      image: imageInput,
      createdBy: user?.displayName
    }).then(
      ()=>{
        setModalVisible(false);
        setNameInput('')
        setImageInput('')
        axios.get("/rooms").then((response) => {
          setRooms(
            response.data.map((data) => ({
              id: data._id,
              data: data,
            }))
          );
        });
      }
    )
  }
  else{
    // add alert
  }

  };
  const content = (
    <div className='sidebar__popover'>
      <p onClick={handleAddNewChat}>Create New Room</p>
      <p onClick={handleLogout}>Logout</p>
    </div>
  );

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon onClick={handleAddNewChat} />
            <Modal
              title="Create new Chat"
              centered
              visible={modalVisible}
              onOk={createNewRoom}
              onCancel={() => setModalVisible(false)}
            >
              <Input
                name="name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter Name"
                prefix={<UserOutlined />}
              />
              <br />
              <br />
              <Input
                name="image"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Enter Image Url (optional)"
                prefix={<FileImageOutlined />}
              />
            </Modal>
          </IconButton>
          <Popover content={content} trigger="click">
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          </Popover>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search a new chat" type="text" />
        </div>
      </div>
      <div className="sidebar__chats">
        {rooms.map((room) => (
          <SidebarChat key={room.id} room={room.data}  />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
