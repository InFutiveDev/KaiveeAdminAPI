const express = require("express");
const reasearchRouter = express.Router();
const reasearchController = require("../controller/reasearch/reasearch");
const { handleFormData } = require("../helpers/formFormidable");

reasearchRouter.post("/add-file",handleFormData,reasearchController.addreasearch);
reasearchRouter.put("/update-file/:id",handleFormData,reasearchController.updatereasearch);
reasearchRouter.delete("/delete-file/:id",reasearchController.deletereasearch);
reasearchRouter.get("/getAll",reasearchController.getAllreasearch);
reasearchRouter.get("/getByid/:id",reasearchController.getReasearchById);

module.exports = reasearchRouter;