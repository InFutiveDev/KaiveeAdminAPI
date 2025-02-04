const express = require("express");
const inquiryRouter = express.Router();
const inquiryController = require("../controller/inquiry/inquiry");


inquiryRouter.delete("/delete/:id", inquiryController.deleteInquiry);
inquiryRouter.get("/getAll", inquiryController.getAllInquiry);


module.exports = inquiryRouter;
