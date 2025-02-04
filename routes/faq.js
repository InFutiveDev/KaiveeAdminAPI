const express = require("express");
const faqRouter = express.Router();
const faqController = require("../controller/faq/faq");

faqRouter.post("/add-faq",faqController.addFAQ);
faqRouter.put("/update-faq/:id",faqController.updateFAQ);
faqRouter.delete("/delete-faq/:id",faqController.deleteFAQ);
faqRouter.get("/getAll-faq",faqController.getAllFAQ);
faqRouter.get("/getBy_id/:id",faqController.getFAQBytestId);

module.exports = faqRouter;
