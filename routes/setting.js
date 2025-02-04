const express = require("express");
const settingRouter = express.Router();
const settingController = require("../controller/setting/setting");

settingRouter.post("/add", settingController.addSetting);
settingRouter.put("/update/:id", settingController.updateSetting);
settingRouter.get("/getAll", settingController.getAllSetting);

module.exports = settingRouter;
