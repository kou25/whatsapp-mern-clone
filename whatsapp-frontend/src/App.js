import React,{useEffect, useState} from 'react'
import Pusher from 'pusher-js'
import './App.css';
import Chat from './component/Chat';
import Sidebar from './component/Sidebar';
import axios from './Axios'

function App() {
const [messages, setMessages]=useState([])
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

console.log(messages)

  return (
    <div className="app">
      <div className="app__body">
      <Sidebar />
      <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
