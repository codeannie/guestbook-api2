const express = require('express');
const bodyParser = require('body-parser');
const { getAllUsers, createNewUser } = require('./user.controller');
const router = express.Router(); 

router.use(bodyParser.json());

// GET ALL USERS
router.get('/', getAllUsers);

// CREATE NEW USER
router.post('/', createNewUser);

module.exports = router; 
