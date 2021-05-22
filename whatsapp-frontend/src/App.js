import React, { useEffect, useState } from "react";
import "./App.css";
import Chat from "./component/Chat";
import Sidebar from "./component/Sidebar";
import Login from "./component/Login";
import { useStateValue } from "./StateProvider";
import { actionType } from "./reducer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./component/Home";
function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (user === null) {
      dispatch({
        type: actionType.SET_USER,
        user: JSON.parse(localStorage.getItem("user")),
      });
    }
  }, []);
  

  
  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <BrowserRouter>
            <Sidebar />
            <Switch>
              <Route path="/room/:roomID">
                <Chat  />
              </Route>
              <Route path="/"><Home/></Route>
            </Switch>
          </BrowserRouter>
        </div>
      )}
    </div>
  );
}

export default App;
