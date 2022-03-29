//to use nodemon type nodemon backend/server.js

const express = require("express"); //express module is shipped inside node_modules i just require it
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");

dotenv.config(); // calling dotenv
connectDB();
const app = express(); //creating instence of above express variable

app.use(express.json()); // i taking input from frontend thats why i have to tell server to accept json data

app.get("/", (req, res) => { //to check backend deployment in heroku
  res.send("API backend is Running! &  deployed in heroku");
});

app.use("/api/user", userRoutes); //abstract all of the logic related to the user inside of the userRoutes file
app.use("/api/chat", chatRoutes); //for chat creation
app.use("/api/message", messageRoutes); //send msg routes


// --------------------------deployment start------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully..");
  });
}

// --------------------------deployment end------------------------------



// Error Handling middlewares /func of wrong routs
app.use(notFound); //if above url doesnt exiest it fall on this particullar things
app.use(errorHandler); //even after it gives other error it comes here 

const PORT = process.env.PORT || 5000;
           //if ^^ .env file is not aviable it auttomaticall use 5000 port  ; && to use .env file i have to import dotenv i & import packege


const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold) //server is running in port localhost:3000/  && .yellow.bold for making it more color stick
);


//*** steps to use socket.io in my proj. */ 
// 1st install it in backend  npm install socket.io
//2nd install in frontendend  npm install socket.io-client
// 3rd connection between frontend & backend

const io = require("socket.io")(server, {
  pingTimeout: 60000,
    //pingTimeout the amount of time it will being  wait before going in-active

  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => { //create a connection wih socket.io & its taks a call back
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => { //every time user open the app he should be connected to its own personal socket
        //here we creating a new socket where froented will send some data and will join a room

    socket.join(userData._id); //created a room
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
        //here we creating joining a chat
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing")); //creting new room for typing && inside this room emit typing
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));


    //creating new socket && for real time measing
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat; //which chat does this belongs to

    if (!chat.users) return console.log("chat.users not defined"); //if above chat doesnt have any users

    chat.users.forEach((user) => { //logic for if i sending a msg it should be recvie to other 4 particaptans execpts me
      if (user._id == newMessageRecieved.sender._id) return; //if sender & new msg id is same then do nothing

      socket.in(user._id).emit("message recieved", newMessageRecieved); //"in" means inside that user's room send that msg
    });
  });

  socket.off("setup", () => { //for cleanup socket for saving bandwith
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});