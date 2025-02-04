const express = require("express");
const biowasteRoute = express.Router();
const biowasteController = require("../controller/biowaste/biowaste");


biowasteRoute.post("/add-waste",biowasteController.addbiowaste);
biowasteRoute.put("/update/:id",biowasteController.updatewaste);
biowasteRoute.delete("/delete/:id",biowasteController.deletewaste);
biowasteRoute.get("/get-all-waste",biowasteController.getAllwaste);
biowasteRoute.get("/get-by-month/:id",biowasteController.getbiowasteByMonth);
biowasteRoute.get("/getById/:id",biowasteController.getbiowasteById);

module.exports = biowasteRoute;