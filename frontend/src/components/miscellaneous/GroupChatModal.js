//creating chakraui popup modal and other functaniloty for groupchat
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
  } from "@chakra-ui/react";
  import axios from "axios";
  import { useState } from "react";
  import { ChatState } from "../../Context/ChatProvider";
  import UserBadgeItem from "../userAvatar/UserBadgeItem";
  import UserListItem from "../userAvatar/UserListItem";
  
  const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [groupChatName, setGroupChatName] = useState(); //this are the states we need
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    
    const [loading, setLoading] = useState(false);

    const toast = useToast();
  
    const { user, chats, setChats } = ChatState();//this context api like as props; this field values will used later user, chats, setChats 
  
    const handleGroup = (userToAdd) => {
      if (selectedUsers.includes(userToAdd)) {
        toast({
          title: "User already added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      setSelectedUsers([...selectedUsers, userToAdd]);
    };
  
    const handleSearch = async (query) => {
      setSearch(query);
      if (!query) {
        return;
      }
  
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/user?search=${search}`, config);
        console.log(data);
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
  
    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));// first filter out the selected users from create group chat tab then do this sel._id !== delUser._id) if it is not equal to deleted id
    };
  
    const handleSubmit = async () => {
      if (!groupChatName || !selectedUsers) { //if groupChatName nane is empty or selectedUsers is empty
        toast({
          title: "Please fill all the feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      try { //api call
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          `/api/chat/group`,
          { //thinks that it takes
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        );
        setChats([data, ...chats]);//i adding this data before the sperading the chat because we want to add it very top of our app 
        onClose(); //to close the modal
        toast({
          title: "New Group Chat Created!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        toast({
          title: "Failed to Create the Chat!",
          description: error.response.data,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };
  
    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              fontFamily="Work sans"
              d="flex"
              justifyContent="center"
            >
              Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody d="flex" flexDir="column" alignItems="center">
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add Users eg: John, Piyush, Jane"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              <Box w="100%" d="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {loading ? (
                // <ChatLoading />
                <div>Loading...</div>
              ) : ( //displaying serch people to add in group by mapping
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                      /*slice(0, 4) for display 1st 4 search result  */
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSubmit} colorScheme="blue">
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default GroupChatModal;