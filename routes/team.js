const express = require("express");
const teamRouter = express.Router();
const teamController = require("../controller/team/team");
const { handleFormData } = require("../helpers/formFormidable");

teamRouter.post("/add",handleFormData,teamController.addteam);
teamRouter.put("/update-team/:id",handleFormData,teamController.updateteam);
teamRouter.delete("/delete-team/:id",teamController.deleteteam);
teamRouter.get("/getAll",teamController.getAllteam);
teamRouter.get("/getByid/:id",teamController.getteamById);

module.exports = teamRouter;