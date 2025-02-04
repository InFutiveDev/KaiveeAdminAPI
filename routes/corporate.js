const express = require("express");
const corporateRouter = express.Router();
const corporateController = require("../controller/corporate-form/corporate");


corporateRouter.delete("/delete/:id",corporateController.deleteCorporate );
corporateRouter.get("/getAll",corporateController.getAllCoporate );


module.exports = corporateRouter;
