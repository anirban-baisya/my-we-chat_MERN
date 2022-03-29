export const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };
  
  export const isSameSender = (messages, m, i, userId) => { //(allof_our masseges ,the current msg , index of the currrent msg , loged inuserid )
    return (
      i < messages.length - 1 && 
      //it will check if length is less then all of the msg 
      (messages[i + 1].sender._id !== m.sender._id ||  //if next msg not equel to current sender
        messages[i + 1].sender._id === undefined) && //if the next msg is undefined or not
      messages[i].sender._id !== userId //current messages is not equal to userid for the left hand sight part to show profile pic in last img
    );
  };
  
  export const isLastMessage = (messages, i, userId) => { //to check very last msg of sender for the left hand sight part to show profile pic in last img
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId && //id of the last message of the array id != to loged in user id
      messages[messages.length - 1].sender._id 
    );
  };
  
  export const isSameUser = (messages, m, i) => { //this is for creating speace between mult. messages
    return i > 0 && messages[i - 1].sender._id === m.sender._id; //if index is more then 0 & sender id of prev. msg == to current msg sender id
  };
  
  export const getSender = (loggedUser, users) => { //it leave the user that is loged in & return the user that is not loged in
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };
  
  export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };