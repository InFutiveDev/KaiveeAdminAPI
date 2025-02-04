const express = require("express");
const healthRiskRouter = express.Router();
const healthRiskController = require("../controller/HealthRisk/healthRisk");

// HendleFormData Middleware Using For Hendling Form Data TextAndFile Both
const { handleFormData } = require("../helpers/formFormidable");

healthRiskRouter.post(
  "/add",
  handleFormData,
  healthRiskController.addHealthRisk
);
healthRiskRouter.put(
  "/update/:id",
  handleFormData,
  healthRiskController.updateHealthRisk
);
healthRiskRouter.delete("/delete/:id", healthRiskController.deleteHealthRisk);
healthRiskRouter.get("/getById/:id", healthRiskController.getHealthRiskById);
healthRiskRouter.get("/getAll", healthRiskController.getAllHealthRisk);

module.exports = healthRiskRouter;
