//jwt basically help us to authorize the users in our backend,   npm i jsonwebtoken
// it make avilable some paritular resource for user like id // https://jwt.io/

const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", //in how many days token will expires
  });
};

module.exports = generateToken;