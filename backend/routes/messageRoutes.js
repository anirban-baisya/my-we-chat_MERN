const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, sendMessage); //1st route for sending the msg

router.route("/:chatId").get(protect, allMessages);  //2nd route is for fetch all of the msg in a particullar chat


module.exports = router;