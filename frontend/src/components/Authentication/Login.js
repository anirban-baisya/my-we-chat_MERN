import React, { useState } from 'react'
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from '@chakra-ui/toast';
import axios from "axios";
import { useHistory } from "react-router";

const Login = () => {
  
    const [show, setShow] = useState(false); //password show state is by defaultle is false

    const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false); //for loading func.
    const toast = useToast();
    const history = useHistory();

    
    const handleClick = () => setShow(!show); //it gon a invert the value of show then the click to show passw func. is work
    

      const submitHandler = async () => {
        setLoading(true);
        if (!email || !password ) {
          //if any of the filed is blank
          toast({
            title: "Please Fill all the Feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
        }

        // console.log(email, password);
        try {
          ///making the api request
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };

          const { data } = await axios.post(
            "/api/user/login",
            { email, password }, //profiding email and password
            config
          );

          // console.log(JSON.stringify(data));
          toast({
            title: "Login Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          localStorage.setItem("userInfo", JSON.stringify(data)); //if login successn storing it in localstroage
          setLoading(false);
          history.push("/chats"); //pussing u to chat page
        } catch (error) {
          //other wise throw error
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        }
      };




  return (
    <VStack spacing="5px"> {/*VStack is used to verticle align itemes*/}

      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
         value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"} //when show value is inverted by handleClick method && if the show value is true then is show txt , other wise shows as password
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
          {/*^^ its a state ; ^^ & this hide/show are work as button for showing /hiding text */}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>



      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>


    </VStack>
  )
}

export default Login