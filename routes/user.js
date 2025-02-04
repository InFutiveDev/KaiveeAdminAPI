const express = require("express");
const userRouter = express.Router();
const userController = require("../controller/user/user");

userRouter.get("/getAll", userController.getAllUser);

module.exports = userRouter;
