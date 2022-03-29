//creating user interface of our chat
import React from 'react'

import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";

import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
 
//const ENDPOINT = "http://localhost:5000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
const ENDPOINT = "https://my-we-chat.herokuapp.com/"; 
  var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => { //reciving fetchAgain, setFetchAgain from chatPage.js
  const [messages, setMessages] = useState([]); //containing all the masages fetched from our backend
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    // animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // const style ={
  //   height: 100,
  //   marginLeft: 0
  // }

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState(); //taking fewthings from our context

  const fetchMessages = async () => { //fetch messages to show all msg one by one like wp msgs

    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      ); //to get all the list of the chat

      console.log(messages);
      setMessages(data); //set all of the msges inside of the state
      setLoading(false);

      socket.emit("join chat", selectedChat._id); //with the id of the chat creating new room , so that user can join this room from server.js
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {  //if the event.key is enter key of the keybord && i have something inside of the new msg
      socket.emit("stop typing", selectedChat._id); //otherwise typing fuctionality is shows 
      try { //fetching api
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        console.log(data)
        socket.emit("new message", data); //to send msg using socket && data that i recive from api call
        setMessages([...messages, data]); //what ever we get from this msg ...messages , add new mesg into array (like wp chats)
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT); // here i starting socket.io 
        //here we creating a new socket where froented will send some data and will join a room from server.js
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true)); //for showing the typing fuc. , when someone typing
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => { //calling all the msges inside of useEffect
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  
  console.log(notification,"----------");

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => { //it see is we recive anything from this scoket backend we put it inside of a chat 
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id //if the conditon satisfi i not gona display the msg notification
      ) { //give msg notification
        if (!notification.includes(newMessageRecieved)) { //if notification that already ther does not include newMessageRecieved the add this newMessageRecieved to notification array 
          setNotification([newMessageRecieved, ...notification]); // for old / remaning ...notification
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]); //otherwise added to list of our messages
      }
    });
  });


   const typingHandler = (e) => { //this func. run every time when we putting every word in input box
    setNewMessage(e.target.value); //setting new msg
        /// Typing indicator logic
    if (!socketConnected) return; //if not scoket connected

    if (!typing) { //if not typing
      setTyping(true);
      socket.emit("typing", selectedChat._id); //sending typing into selectedChat._id room
    }

    //this for stop typing notifier after 3 sec if any inputs are not entering
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
   };

  return (
    <>
      {selectedChat ? ( //if selectedChat is true (means any of the chat is not clicked from left side)
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }} //base == smaller scr. && md == larger scr.
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }} //base == smaller scr. 
            alignItems="center"
          >
            <IconButton //base == smaller scr.. (it will only display when display size is small for back arrow)
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {messages &&
              (!selectedChat.isGroupChat ? ( //if the selected chat is not a group chat then do something
                <>
                  {getSender(user, selectedChat.users)}   {/*it to show chat members in left side */}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)} //And to see the members profile detailes by clicking on the eye icon
                  />
                </>
              ) : (//if the selected chat is a group chat then do something
                <>
                  {selectedChat.chatName.toUpperCase()}   {/*display the name of the group in uppercase  */}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>

          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          > 
                       {/*messages here ,sending messages  , input msg bar for type msg*/}
            {loading ? ( //if the messages are still loading i gona show a spiner
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              /> //it will imported from chakra-ui
            ) : ( //else do something else
              <div className="messages">
                <ScrollableChat messages={messages} />  {/*inside this div i have all of our messages ui*/}
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage} //for whenever i press enter key on keybord the msg should be sent
              id="first-name"
              isRequired
              mt={3}
            >  {/*input box for typing messages   */}

              {istyping ? ( //if typing then perform
                <div> 
                {/* this to show typing animation using lottie animation */}
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    // width={70}
                    style={{ marginBottom: 15, marginLeft: 0 , height: 35}}
                    // style={style}
                    animationData={animationData}
                  />
                  {/* Typing ... */}
                </div>
              ) : ( //other wise do nothing
                <></>
              )}

              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler} // for the typing functonality
              />
            </FormControl>

          </Box>
        </>
      ) : ( //if selectedChat is false (means any of the chat is not clicked from left side)
        // to get socket.io on same page
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;


/// for typing animation i using lottie animation  https://lottiefiles.com/search?q=typing&category=animations  
// and to use it click on the file then click on download then click on lottie JSON
// && to display all the animation i have to insall a libery also npm i react-lottie  or npm i lottie-react