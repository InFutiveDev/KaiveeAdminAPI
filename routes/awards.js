const express = require("express");
const awardRouter = express.Router();
const awardController = require("../controller/awards/award");
const { handleFormData } = require("../helpers/formFormidable");

awardRouter.post("/add-award",handleFormData,awardController.addaward);
awardRouter.put("/update-award/:id",handleFormData,awardController.updateaward);
awardRouter.delete("/delete-award/:id",awardController.deleteaward);
awardRouter.get("/getAll",awardController.getAllaward);
awardRouter.get("/getByid/:id",awardController.getawardById);

module.exports = awardRouter;