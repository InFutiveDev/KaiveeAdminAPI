const express = require("express");
const newsRoute = express.Router();
const newsController = require("../controller/news/news");
const { handleFormData } = require("../helpers/formFormidable");


newsRoute.post("/add",handleFormData,newsController.addNews);
newsRoute.put("/update/:id",handleFormData,newsController.updateNews);
newsRoute.delete("/delete/:id",newsController.deleteNews);
newsRoute.get("/getAll",newsController.getAllNews);
newsRoute.get("/getById/:id",newsController.getNewsById);

module.exports = newsRoute;