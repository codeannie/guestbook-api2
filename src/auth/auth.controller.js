const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const { User } = require('../user/user.model');
const config = require('../config');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

const createAuthToken = user => {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.email,
    expiresIn: config.JWT_EXPIRY,
    algorithm: "HS256"
  });
};

// SIGN UP AS NEW USER
const signUpAuth = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = await User.hashPassword(password);
  
  // check if user already exists
  const existingUser = await User.findOne({
    email
  });
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  // create new user
  const newUser = await User.create({
    email,
    password: hashedPassword
  });

  return res.status(200).json({
    user: newUser.toClient()
  })
};


// LOGIN AS EXISTING USER
const logInAuth = (req, res) => {
  const email = req.body.email;
  const userPassword = req.body.password;
  User.findOne({ email: email })
    .then(async user => {
      if (!user) {
        return Promise.reject({
          reason: "LoginError",
          message: "Incorrect email or password"
        });
      }
      return {
        user,
        isValid: await user.validatePassword(userPassword)
      };
    }) 
    //if user exists, check password
    .then(result => {
      if (!result.isValid) {
        return Promise.reject({
          reason: "LoginError",
          message: "Incorrect email or password"
        });
      }
      //if password correct, create auth token
      const authToken = createAuthToken(result.user.toClient());
      res.status(200).json({
        meta: "success",
        userId: result.user._id,
        authToken
      });
    })
    .catch(err => {
      if (err.reason === "LoginError") {
        return res.status(401).json({ message: err.message });
      }
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
};

// REFRESH TOKEN FOR EXISTING USER
const refreshAuthToken = (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
};

module.exports = {
  signUpAuth,
  logInAuth,
  refreshAuthToken
}
