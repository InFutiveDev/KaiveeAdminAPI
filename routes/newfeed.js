const express = require("express");
const feedbackRouter = express.Router();
const feedbackController = require("../controller/newfeeds/feedbacks");


feedbackRouter.delete("/delete/:id", feedbackController.deletefeedback);
feedbackRouter.get("/getAll", feedbackController.getAllFeeds);


module.exports = feedbackRouter;
