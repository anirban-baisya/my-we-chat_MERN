import { Box, Text } from "@chakra-ui/layout";
import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuDivider, MenuItem, MenuList, Tooltip } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input
} from '@chakra-ui/react'
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import axios from "axios";
import UserListItem from './../userAvatar/UserListItem';
import { Spinner } from "@chakra-ui/spinner";
import { getSender } from "../../config/ChatLogics";

import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";




function SideDrawer() {
  const [search, setSearch] = useState(""); //user serch
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

    const {
      setSelectedChat,
      user,
      notification,
      setNotification,
      chats,
      setChats,
    } = ChatState(); 

    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure(); // this is for popup drawer for find user
    const history = useHistory();

    const logoutHandler = () => { //for logout func.
      localStorage.removeItem("userInfo");
      history.push("/");
    };

    const handleSearch = async () => {
      if (!search) {
        //is something in our search
        toast({
          //toast is used to give popup
          title: "Please Enter something in search",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
        return;
      }

      try { //here i do api call for searching user
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`, //sending jwt token
          },
        };

        const { data } = await axios.get(`/api/user?search=${search}`, config); //disstructure the data from api call

        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };


    const accessChat = async (userId) => { //its create a new chat with the searched user
      console.log(userId);

      try {
        setLoadingChat(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(`/api/chat`, { userId }, config); //it will return that chat will created previously

        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]); //if we find chats inside of the list then it just going to update the chats inside of setChats
        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
      } catch (error) {
        toast({
          title: "Error fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          {/*toltip shows on hover*/}
          <Button variant="ghost" onClick={onOpen}> {/*for opening the drawer*/}
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              {/* base: "none", md: "flex" is for different screen size*/}
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
        We-Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
          {/* //this is to display notification popup no over bell icon */}
              <NotificationBadge
                count={notification.length} //it taks the count of notification using react-notification-badge
                effect={Effect.SCALE}
              />

              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>  {/*this is for chat notification bell comes from sideDrawer.js  */}
              {!notification.length && "No New Messages"}         {/*if notofication is not ther then just say no new msg when i click on bell icon  */}
              {notification.map((notif) => (   // if notification is there then map it
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    //this is to display full mesg when i click the notifiaction from bell icon
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif)); //after clicking on the notification msg remove that notification from array of noification after opening the chat page for that i am filtering out
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}` // if this is for a group chat then display nam of the chat group
                    : `New Message from ${getSender(user, notif.chat.users)}`}      {/* if it is one & one chat then type new msg  from sender name ; getSender from chatLogic.js ; (user, notif.chat.users) user then the , list of the users */}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu> 
          {/* profile menu */}
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
            //   The Avatar component is used to represent a user, and displays the profile picture, initials or fallback icon.
                size="sm"
                cursor="pointer"
                name={user.name} //if ther is not any profile pic avilable then it will display like AB for Anirban Baisya from Userstate (ChatState) 
                src={user.pic}
              /> 
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />{/*its a one stright line*/}
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>


            {/* creating left side popup drawer for searching the user ; https://chakra-ui.com/docs/components/overlay/drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button 
              onClick={handleSearch}
              >Go</Button>
            </Box>
            {loading ? ( //if the loading is true then do some loading stups
              <ChatLoading />
            ) : ( //otherwise display all of the search result
                  //rendering all of api fetched things from handleSearch
               searchResult?.map((user) => ( //searchResult? if there is some thing inside search result then map
                <UserListItem 
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                /> //i displaying fetched data inside of a component this UserListItem component provides a structure 
              ))
        
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />} {/*for the loading spinner*/}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;


// for adding notification indicator/badge i using react notification badge
//to install in frontend npm i react-notification-badge
// https://www.npmjs.com/package/react-notification-badge