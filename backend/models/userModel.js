const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");//it to stor encrpted pasword in database

const userSchema = mongoose.Schema(
  { //what are the things that a user data can contain :-
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      // required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    }, //if there is no pic given by user then it taks the above default pic.
    // isAdmin: {
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },
  },
  { timestaps: true }
);

//method to compare user entered password & bcrypt's encrypted password
userSchema.methods.matchPassword = async function (enteredPassword) { 
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  //method to store password in encrepeted formate in database
userSchema.pre("save", async function (next) { //means :before saving add a func. here
  if (!this.isModified) { // if current password is not modified move on to the next(means dont run the code)
    next();
  }

  const salt = await bcrypt.genSalt(10); //otherwise generate a new encrep password using bcrypt (  npm i bcrypt )
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;