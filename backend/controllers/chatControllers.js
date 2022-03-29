const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => { //this route is responsible for creating & fetching 1&1 chat
  const { userId } = req.body;//current user who ever loged in is going to send us the user id
    // console.log(req.body);
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({ //if chat is exist with tuser
    isGroupChat: false, //its a one & one chats thats why its false
    $and: [ //both of the request have to be true
      { users: { $elemMatch: { $eq: req.user._id } } },// matching courrent user that is loged in
      { users: { $elemMatch: { $eq: userId } } },//user that we requesting
    ],
  })//if the chat is found
    .populate("users", "-password")//excpt password retuning user details
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) { //if chat exists we gona send the chat
    res.send(isChat[0]);
  } else { //otherewise we create the chat
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],// courrent user that is loged in , user that we requesting
    };

    try { //now query it & store it in our database
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );//find the chat with createdChat 
      res.status(200).json(FullChat); // send to server
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});




//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => { //fetch all the chat of particular logged user & return in which chats the user is part of   func.
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 }) //new to old chats
      .then(async (results) => {
        results = await User.populate(results, { 
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);// retun to user
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});



// //@description     Create New Group Chat
// //@route           POST /api/chat/group
// //@access          Protected
const createGroupChat = asyncHandler(async (req, res) => { //it taks bunch of user from the body & tak the name of the groupchat
  if (!req.body.users || !req.body.name) { //if the filled doest have anything
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);//taking all the user from body and parse it

  if (users.length < 2) { //group should have more than 2 user
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);//ading loged user also in add gropchat & all the othe users 

  try {
    const groupChat = await Chat.create({ //creating a new group chat
      chatName: req.body.name,// it have grop name
      users: users, //users
      isGroupChat: true, //is its a group chat or not
      groupAdmin: req.user, // and the group admin
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })//fetch the chat from database & send it back to the user
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});



// // @desc    Rename Group
// // @route   PUT /api/chat/rename
// // @access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body; //it taks chat id and name that i want to give

  const updatedChat = await Chat.findByIdAndUpdate( //find the chat id and update the name
    chatId,
    {
      chatName: chatName, //suppose to update
    },
    {
      new: true,//return updated value
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});



// // @desc    Add user to Group / Leave
// // @route   PUT /api/chat/groupadd
// // @access  Protected
const addToGroup = asyncHandler(async (req, res) => { //
  const { chatId, userId } = req.body; //we need chat id in which we want to add user

  // check if the requester is admin
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },//push the userarry that want to add 
    },
    {
      new: true,//return updated value
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});



// // @desc    Remove user from Group
// // @route   PUT /api/chat/groupremove
// // @access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },//pull/delete the user arry that want to remove 
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});



module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
