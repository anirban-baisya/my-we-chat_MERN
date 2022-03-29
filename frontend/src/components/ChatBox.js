// this is to create right hand sight part means typing chat part ui
import React from 'react'
import { Box } from "@chakra-ui/layout";
// import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => { //reciving fetchAgain, setFetchAgain from chatPage.js
  const { selectedChat } = ChatState(); //when ever chat is selected we need to open the chat page

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }} //when ever chat is selected /opend then the right hand sight will visable & left hand sight part will not visable and revers thing will hapen when chat is not selected  (this thing only work in smaller screen size)
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> {/* inside single chat there having functionality of delet chat etc.. , leave group */}
    </Box>
  );
};

export default Chatbox;