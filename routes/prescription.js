const express = require("express");
const prescriptionRouter = express.Router();
const prescriptionController = require("../controller/prescription/prescription");
const { handleFormData } = require("../helpers/formFormidable");

prescriptionRouter.get("/getAll",prescriptionController.getAllprescription)
prescriptionRouter.get("/getby-id/:id",prescriptionController.getById);

module.exports = prescriptionRouter;