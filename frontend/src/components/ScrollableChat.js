//creating chat interface where new & previous chat will display 
// installing react scrollable feed
import React from 'react'
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState(); //taking user from context api

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => ( //if something inside messages then messages.map(m,i)current msg & the index
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow> 
              {/*if i hover ther is also a tooltip shown the name of the sender */}
                <Avatar //if any of the condition is true then it display the avatar/ profile dp in the last msg of sender
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0" //sender.id == loged in id so #BEE3F8 this color otherwise other color
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content} 
             </span>{/*rendering msg  */}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;