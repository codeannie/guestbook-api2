// import express from 'express';
const express = require('express');
// import bodyParser from 'body-parser';
const bodyParser = require('body-parser');
// import { createNewUser, getAllUsers } from './user.controller';
const { getAllUsers, createNewUser } = require('./user.controller');
const router = express.Router(); 

router.use(bodyParser.json());

// GET ALL USERS
router.get('/', getAllUsers);

// CREATE NEW USER
router.post('/', createNewUser);

module.exports = router; 
// export default router; 