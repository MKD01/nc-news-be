const express = require('express');
const { getUsersByUserId } = require('../controllers/users.controllers');

const userRouter = express.Router();

userRouter.get('/:username', getUsersByUserId);

module.exports = userRouter;
