const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controller/category/category");

// HendleFormData Middleware Using For Hendling Form Data TextAndFile Both
const { handleFormData } = require("../helpers/formFormidable");

categoryRouter.post("/add", handleFormData, categoryController.addCategory);
categoryRouter.put("/update/:id",handleFormData, categoryController.updateCategory);
categoryRouter.delete("/delete/:id", categoryController.deleteCategory);
categoryRouter.get("/getById/:id", categoryController.getCategoryById);
categoryRouter.get("/getAll", categoryController.getAllCategory);

module.exports = categoryRouter;
