
 const asyncHandler = require("express-async-handler"); // this is a package called express-async-handler which handle all of the conttollers errors automatically (npm i express-async-handler)

 const User = require("../models/userModel"); //user is the model that we are created
const generateToken = require("../config/generateToken");



//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public

const allUsers = asyncHandler(async (req, res) => { //this is to find / add users in group / personl
  //here we using querys
  const keyword = req.query.search // /api/user?search=anirban
    // console.log(keyword); 
  ? { // ? if there any query inside of it then search the user in there name/email
        $or: [ //The mongoDB $or operator performs a logical OR operation on an array of two or more <expressions> and selects the documents that satisfy at least one of the <expressions>. 
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};//else it dont do nothing

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });//it will return all the users accept loged in user
  res.send(users);//returnig
});




//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => { //defing registerUser contoroller from userRoute.js
  const { name, email, password, pic } = req.body; //distructing all of name, email, password, pic from body

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds"); //if any of this is undefind it will throw error
  }

  const userExists = await User.findOne({ email }); //it check user is exist or not ; findOne is a mongodb querry

  if (userExists) { //if email existis it will throw a errow
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ //it will creta a new user
    name,
    email,
    password,
    pic,
  });

  if (user) { //if something in user avilable
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),//when i sending the json data to user i also need to send a jswt token to user for that i have to create a func. in config file
    });//after it gona send to user
  } else {
    res.status(400);
    throw new Error("Failed to Create the User");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public

const authUser = asyncHandler(async (req, res) => { /// this is for user login
  const { email, password } = req.body; //it taks 2 thing to login

  const user = await User.findOne({ email }); //check user is exists in database or not

  if (user && (await user.matchPassword(password))) { //if user existes && enterd password matches our datbase
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

module.exports = { allUsers, registerUser, authUser };
