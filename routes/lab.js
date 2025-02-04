const { Router } = require("express");
const labRoute = Router();
const labController = require("../controller/booking/labController");


labRoute.post("/add", labController.addLabDetail);
labRoute.put("/update/:id", labController.updateLabDetail);
labRoute.delete("/delete/:id", labController.deleteLabDetail);
labRoute.get("/byId/:id", labController.getByIdLabDetail);
labRoute.get("/getAll", labController.getAllLabDetail);

module.exports = labRoute;
