//this is left side part myChats page
import { Box } from "@chakra-ui/layout";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";

import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false); //this is to when someone del the chat from chatBox page/chat typing pg it is for rerender the left side chat once more

  const { user } = ChatState(); //distructing from context api
  const [chats, setChats] = useState([]);//to store api data

  const fetchChats = async ()=>{  //rendering data from frontend to backend using axious
    const {data}= await axios.get("/api/chat"); // disstructring data using { } so that we can get only this specific data from the array 
    //const {data}= await axios.get("/api/chat"); 
    console.log(data);
    setChats(data);
  };

  useEffect(() => { 
    fetchChats();//when ever component is rendred for the 1st time it will be called
  }, [])
  


  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />} {/* this is the sideDrawer of chat page ui*/}
       <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        
         {user && <MyChats fetchAgain={fetchAgain} />}     {/*If user is there then render mychat component*/}
        
         {user && (
           <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
         )}
       </Box>       
       
     </div>
    /* <>
    {chats.map((chat)=> (
      <div key={chat._id}>{chat.chatName}</div> //to fetch only chatName from the array
    ))}
    
    </> */
  );
};

export default ChatPage;