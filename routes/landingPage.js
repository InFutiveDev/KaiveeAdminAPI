const express = require("express");
const landingPageRouter = express.Router();
const landingPageController = require("../controller/landingPage/landingPage");
const { handleFormData } = require("../helpers/formFormidable");

landingPageRouter.post("/add",handleFormData,landingPageController.addLandingPage);
landingPageRouter.get("/getall",landingPageController.getAlllandingpage);
landingPageRouter.get("/getById/:id",landingPageController.getLandingPageById);
landingPageRouter.delete("/delete/:id",landingPageController.deletelandingPage);
landingPageRouter.put("/update/:id",handleFormData,landingPageController.updatelandingpage);
landingPageRouter.put("/update_test/:id",landingPageController.updatetestlandingpage);


module.exports = landingPageRouter;