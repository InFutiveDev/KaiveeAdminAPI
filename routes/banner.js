const express = require("express");
const bannerRouter = express.Router();
const bannerController = require("../controller/banner/banner");

// HendleFormData Middleware Using For Hendling Form Data TextAndFile Both
const { handleFormData } = require("../helpers/formFormidable");

bannerRouter.post("/add", handleFormData, bannerController.addBanner);
bannerRouter.put("/update/:id", handleFormData, bannerController.updateBanner);
bannerRouter.delete("/delete/:id", bannerController.deleteBanner);
bannerRouter.get("/getById/:id", bannerController.getBannerById);
bannerRouter.get("/getAll", bannerController.getAllBanner);

module.exports = bannerRouter;
