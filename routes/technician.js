const express = require("express");
const technicianRouter = express.Router();
const technicianController = require("../controller/technician/technician");
const { handleFormData } = require("../helpers/formFormidable");

technicianRouter.post("/add",handleFormData,technicianController.addtechnician);
technicianRouter.put("/update-technician/:id",handleFormData,technicianController.updatetechnician);
technicianRouter.delete("/delete-technician/:id",technicianController.deletetechnician);
technicianRouter.get("/getAll",technicianController.getAlltechnician);
technicianRouter.get("/getByid/:id",technicianController.gettechnicianById);


module.exports = technicianRouter;