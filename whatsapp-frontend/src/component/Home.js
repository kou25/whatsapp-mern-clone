
import React, { useState, useEffect} from "react";
import "../static/css/chat.css";

function Home() {
 
  return (
    <div className="chat">
     <div className="home__container">
        <div className="home__image">
        <img src='https://web.whatsapp.com/img/intro-connection-hq-dark_f8cb12a6fc73afaf9d5903b7849bebd6.jpg'/>
        </div>
        <div className="home__text">
            <p>Click on the chat or create a new room to get started</p>
        </div>
     </div>
    </div>
  );
}

export default Home;
