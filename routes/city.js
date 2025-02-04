const express = require("express");
const cityRouter = express.Router();
const cityController = require("../controller/city/city");


cityRouter.get("/getBy-id",cityController.getcityById);
cityRouter.get("/get-all",cityController.getAllcity);
cityRouter.delete("/delete",cityController.deleteCity);

module.exports = cityRouter;