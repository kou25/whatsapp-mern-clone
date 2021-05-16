import React,{useEffect, useState} from 'react'
import Pusher from 'pusher-js'
import './App.css';
import Chat from './component/Chat';
import Sidebar from './component/Sidebar';
import axios from './Axios'
import Login from './component/Login';
import { useStateValue } from './StateProvider';
import { actionType } from './reducer';

function App() {

const [messages, setMessages]=useState([])
const [{user},dispatch] = useStateValue()

useEffect(()=>{
if(user===null){
  dispatch({
    type: actionType.SET_USER,
    user:JSON.parse(localStorage.getItem('user'))
})
}
},[])
useEffect(
    ()=>{
      axios.get('/messages/sync').then(response=>{
        setMessages(response.data)
      })
    },[]
  )

useEffect(
  ()=>{
    const pusher = new Pusher('5be31c0d421971904201', {
          cluster: 'ap2'
        });

        const channel = pusher.subscribe('messages');
        channel.bind('inserted', (newMessages)=> {
          setMessages([...messages,newMessages])
        });

        return ()=>{
          channel.unbind_all();
          channel.unsubscribe();
        }
  },[messages]
)
  return (
    <div className="app">
       {!user ? <Login/> : (
      <div className="app__body">
        
      <Sidebar messages={messages}/>
      <Chat messages={messages}/>
      </div>
    )}
    </div>
  );
}

export default App;
