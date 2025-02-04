const express = require("express");
const appointmentRouter = express.Router();
const appointmentController = require("../controller/appointment/appointment");


appointmentRouter.get("/getAll",appointmentController.getAllappointment);

module.exports = appointmentRouter;