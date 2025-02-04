const express = require("express");
const careerRouter = express.Router();
const careerController = require("../controller/career/career");

careerRouter.post("/add-carrer",careerController.addCarrer);
careerRouter.put("/update/:id",careerController.updateCarrer);
careerRouter.get("/getAll", careerController.getAllCareer);
careerRouter.delete("/delete/:id",careerController.deleteCarrer);
careerRouter.get("/getbyId/:id",careerController.getByIdCarrer);

module.exports = careerRouter;
