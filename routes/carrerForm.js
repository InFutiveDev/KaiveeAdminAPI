const express = require("express");
const carrer_formRouter = express.Router();
const carrer_formController = require("../controller/carrer_form/carrer_form");



carrer_formRouter.get("/getAll", carrer_formController.getAllCarrerApplication);


module.exports = carrer_formRouter;
