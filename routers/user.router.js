const express = require("express");
const { getUsersByUsername } = require("../controllers/users.controllers");

const userRouter = express.Router();

userRouter.get("/:username", getUsersByUsername);

module.exports = userRouter;
