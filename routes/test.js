const express = require("express");
const testRouter = express.Router();
const testController = require("../controller/test/test");
const testUpdate = require("../helpers/testUpdate");
const { handleFormData } = require("../helpers/formFormidable");


testRouter.post("/add",handleFormData, testController.addTest);
testRouter.put("/update/:id",handleFormData, testController.updateTest);
testRouter.delete("/delete/:id", testController.deleteTest);
testRouter.get("/getById/:id", testController.getTestById);
testRouter.get("/getAll", testController.getAllTest);
testRouter.get("/getAllid",testController.getAllconvertcatId);
//testRouter.put("/addExcel", testController.addTestExcel);
testRouter.put("/update-feature/:id",testController.testByfeaturedCategory);
testRouter.put("/updatetype",testController.geturl);
testRouter.put("/testStatus/:id",testController.updatetestByStatus);
testRouter.get("/test-update",testUpdate.updateTests);

module.exports = testRouter;
