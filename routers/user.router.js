const express = require('express');

const userRouter = express.Router();

userRouter.get('/');

userRouter.get('/:username');

module.exports = userRouter;
