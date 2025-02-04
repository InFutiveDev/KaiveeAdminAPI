const express = require("express");
const hebitRouter = express.Router();
const hebitController = require("../controller/hebit/hebit");

// HendleFormData Middleware Using For Hendling Form Data TextAndFile Both
const { handleFormData } = require("../helpers/formFormidable");

hebitRouter.post("/add", handleFormData, hebitController.addHebit);
hebitRouter.get("/getAll", hebitController.getAllHebit);
hebitRouter.put("/update/:id", handleFormData, hebitController.updateHebit);
hebitRouter.delete("/delete/:id", hebitController.deleteHebit);
hebitRouter.get("/getById/:id", hebitController.getHebitById);

module.exports = hebitRouter;
