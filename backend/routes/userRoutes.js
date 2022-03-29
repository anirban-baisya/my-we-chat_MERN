//here we write all our routes which are related to our user
const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userControllers");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();//cretating istence of our router from express

//creating differt routing
router.route("/").get(protect,allUsers); //before going allUsers request it go to the protect midleware
router.route("/").post(registerUser); //registerUser now we gona create 2 conteralers
router.post("/login", authUser);// 2nd conteraler

module.exports = router;