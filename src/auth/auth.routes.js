const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const { User } = require("../user/user.model");
const config = require("../config");
const controller = require('../auth/auth.controller.js');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


// sign up 
router.post(
  '/signup',
  controller.signUpAuth
);

//check if email and password match
router.post(
  '/login',
  controller.logInAuth
);

router.post(
  '/refresh',
  passport.authenticate("jwt", { session: false }),
  controller.refreshAuthToken
);

module.exports = router;
