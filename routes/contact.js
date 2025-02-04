const express = require("express");
const contactRoute = express.Router();
const contactController = require("../controller/contact/contact");


contactRoute.get("/getAll",contactController.getAllContactList);
contactRoute.get("/get-by-id/:id",contactController.getContactById);


module.exports = contactRoute;