//**** to create modal i have to install mongoose 1st by using  npm i mongoose
// mongoose is used to connect to our mongoDB datbase & to make queries to our data base
//by using this modales mongoDB will understand how we need to structure our data inside our mongo database

// here we write scheema (scheema defines what is the structure of a data we going to take ; & once scheema is done we have to comozit as model , because without model we cant do anything)
// IN mongoose one scheema refers only one collection/database for multiple collections we have to define multiple schema ex. for login we have to create one schema & for register we have to create another schema page 

const mongoose = require('mongoose'); //here also i have to import Mongoose 

/* steps:- 
1. Schema ,
2. Modal
*/

// 1step writing schema :-
var chatModel = mongoose.Schema(
  {
    //mongoose.Schema() its a function in that func. we will passing a json
    //1st i have to tell how many fileds i want for one collection/database inside of MongoDB Atlas server data base

    chatName: {
      type: String,
      trim: true, //2nd step what type of data we want to collect
      //^^ it taks string only as input ; // ^^ it elemenate the space after or before in inputs
    },
    isGroupChat: {
      type: Boolean,
      default: false,
      //^^ it taks true/false ; // ^^ other wise it takes false by default means its not a group chat
    },
    users: [ //we have to write it in array because , signal chat can have 2 user & group chat can have more than 2 users 
      {
        type: mongoose.Schema.Types.ObjectId, // it will contain the id of the particlur user
        ref: "User", //ref of User model
        //^^ it taks date only string  ; // ^^ the value should be unique
      },
    ],
    latestMessage: { //to keep track of the latest msg es so we diplay it below the names  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },
    groupAdmin: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
  },

    {timestamps: true} //if any new data is being added every time it will create a new timestamps
 
);
    const Chat = mongoose.model('Chat', chatModel); //converting schema into modal 2nd step
    module.exports = Chat;


    //When we talk about a single chat what are thing it going to contain
// chatName
// isGroupChat
// users
// latestMessage
// groupAdmin
                    //^^ Now we will create the fields