const { Router } = require("express");
const adminRoleRoute = Router();
const adminRoleController = require("../controller/admin/adminRoleController");


adminRoleRoute.post("/add", adminRoleController.addAdminRole);
adminRoleRoute.put("/update/:id", adminRoleController.updateAdminRole);
adminRoleRoute.delete("/delete/:id", adminRoleController.deleteAdminRole);
adminRoleRoute.get("/byId/:id", adminRoleController.getByIdAdminRole);
adminRoleRoute.get("/getAll", adminRoleController.getAllAdminRole);

module.exports = adminRoleRoute;
