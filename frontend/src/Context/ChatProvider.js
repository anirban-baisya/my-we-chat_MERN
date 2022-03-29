// contextapi help us to manage the state of our app , The reason for adding context api is to avoid the passing of props if there is a chain of children components.
// Without the use of context api, we have to pass the props through all the intermediate components. The other alternative solution is to use third party library such as Redux for maintaining a central store.

import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext(); //we have created our context api succfuly

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]); //global state for the msg notification

  const history = useHistory();

  useEffect(() => { //to fetch our local stroage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo){

        history.push("/");//if user info is not there it will redricty to login page
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);//[history] if ther is any changes occur history it will automatically call useEffect && send this below to our app soit can be use as context api

  return (
    <ChatContext.Provider
      value={{ //this state can be assicable throught of our app
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => { //to make assciable state to other parts of our app for that i have to use a hook called useContext
  return useContext(ChatContext);
};

export default ChatProvider;