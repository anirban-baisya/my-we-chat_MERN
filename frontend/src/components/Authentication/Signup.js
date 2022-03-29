import React, { useState } from 'react'
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useHistory } from "react-router";

const Signup = () => {
    const [show, setShow] = useState(false); //password show state is by defaultle is false
    const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();

  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false); //for loading func.
  
    const toast = useToast();
    const history = useHistory();


    const handleClick = () => setShow(!show); //it gon a invert the value of show then the click to show passw func. is work
    
    const postDetails = (pics) => { //imegae upload func.
      setPicLoading(true);
      if (pics === undefined) {
        toast({//toast to popup error
          title: "Please Select an Image!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }

      console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {//png/jpeg or not
      const data = new FormData(); //creating from data
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "anirban-baisya");
      fetch("https://api.cloudinary.com/v1_1/anirban-baisya/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());//seting response in setPic
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => { //if there any error comes
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

      const submitHandler = async () => { //on from submit
        setPicLoading(true); //for loading funcalitonnly
        if (!name || !email || !password || !confirmpassword) { //if any of the filed is blank
          toast({
            title: "Please Fill all the Feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setPicLoading(false);
          return;
        }

        if (password !== confirmpassword) { //if both password match or not
          toast({
            title: "Passwords Do Not Match",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }

        console.log(name, email, password, pic);
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post(
            "/api/user",
            {
              name,
              email,
              password,
              pic,
            },
            config
          ); //sending data to database
          console.log(data);
          toast({
            title: "Registration Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          localStorage.setItem("userInfo", JSON.stringify(data)); //storng the data in localstroage
          setPicLoading(false);

          history.push("/chats"); //if user is login succfully we push him user to chat page
        } catch (error) { //if any error occurs
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setPicLoading(false);
        }
      };




  return (
    <VStack spacing="5px"> {/*VStack is used to verticle align itemes*/}
    
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)} //for storing the input in setName
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
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
            // type={"password"}
            placeholder="Enter Password"
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


      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"} 
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"} 
            {/*^^ its a state ; ^^ & this hide/show are work as button for showing /hiding text */}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>


      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"//it will accept only img
          onChange={(e) => postDetails(e.target.files[0])} //its for if user select multiple img it will takes only one img
        />
      </FormControl>


      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
        // isLoading={loading}
      >
        Sign Up
      </Button>


    </VStack>
  )
}

export default Signup