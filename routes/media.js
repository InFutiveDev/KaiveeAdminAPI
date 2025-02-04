const express = require("express");
const mediaRoute = express.Router();
const mediaController = require("../controller/media/media");
const { handleFormData } = require("../helpers/formFormidable");

mediaRoute.post("/add", handleFormData, mediaController.addMedia);
mediaRoute.put("/update/:id", handleFormData, mediaController.updateMedia);
mediaRoute.delete("/delete/:id", mediaController.deleteMedia);
mediaRoute.get("/getById/:id", mediaController.getMediaById);
mediaRoute.get("/getAll", mediaController.getAllMedia);

module.exports = mediaRoute;
