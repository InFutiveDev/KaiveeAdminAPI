const express = require("express");
const franchiseRouter = express.Router();
const franchiseController = require("../controller/franchise/franchise");


// franchiseRouter.delete("/delete/:id", feedbackController.deletefeedback);
franchiseRouter.get("/getAll", franchiseController.getAllFranchise);


module.exports = franchiseRouter;
