import React from 'react'
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useEffect } from 'react';
import { useHistory } from 'react-router';


const Homepage = () => {

  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats"); ///if user is ther push it to chats pge
  }, [history]);


  return (
    //here i start designing the login part using @chakra-ui
    <Container maxW="xl" centerContent> {/* container used to making content responsive for every screen size*/}
      <Box //it is same as div
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      > 
        <Text fontSize="4xl" fontFamily="Work sans" color='black'>
          We-Chat
        </Text>
      </Box>


      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
      
        <Tabs isFitted variant="soft-rounded">  {/* https://chakra-ui.com/docs/disclosure/tabs */}
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          
          <TabPanels>

            <TabPanel> {/*Contents component inside of the tabpanel  */}
              <Login />
            </TabPanel>

            <TabPanel>
              <Signup />
            </TabPanel>
          
          </TabPanels>
        </Tabs>
      
      </Box>
    </Container>
  )
}

export default Homepage