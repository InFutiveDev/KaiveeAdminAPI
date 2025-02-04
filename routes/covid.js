const express = require("express");
const covidRouter = express.Router();
const covidController = require("../controller/covid-19/covid");
const { handleFormData } = require("../helpers/formFormidable");

covidRouter.post("/add",handleFormData,covidController.addcovidData);
covidRouter.delete("/delete/:id",covidController.deleteCovidData);
covidRouter.get("/getAll",covidController.getAllCovidData);

module.exports = covidRouter;