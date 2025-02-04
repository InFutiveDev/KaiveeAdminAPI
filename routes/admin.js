const { Router } = require("express");
const AdminRoute = Router();
const AdminController = require("../controller/admin/adminController");


AdminRoute.post("/add", AdminController.addAdmin);
AdminRoute.put("/update/:id", AdminController.updateAdmin);
AdminRoute.delete("/delete/:id", AdminController.deleteAdmin);
AdminRoute.get("/byId/:id", AdminController.getByIdAdmin);
AdminRoute.get("/getAll", AdminController.getAllAdmin);

module.exports = AdminRoute;
