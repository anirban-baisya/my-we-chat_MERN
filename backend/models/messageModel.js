const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  { //a mesg contain 3 things :-
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },//from whis is belongs to
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, 
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageModel);
module.exports = Message;