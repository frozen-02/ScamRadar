const JWT = require("jsonwebtoken");
const dotenv = require('dotenv')
dotenv.config();
const secret = process.env.JWT_SECRET_KEY;

function createTokenForUser(user) {
  const payload = {
    userId: user._id,
  };

  const token = JWT.sign(payload, secret);
  console.log(token);
  return token;
}

function validateToken(token) {
  console.log(token);
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = { createTokenForUser, validateToken };
