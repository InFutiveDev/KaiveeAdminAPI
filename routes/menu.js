const { Router } = require("express");
const menuRoute = Router();
const menuController = require("../controller/menu/menuController");

menuRoute.post("/add", menuController.addMenu);
menuRoute.put("/update/:id", menuController.updateMenu);
menuRoute.delete("/delete/:id", menuController.deleteMenu);
menuRoute.get("/byUserId", menuController.getByUserIdMenu);
menuRoute.get("/byId/:id", menuController.getByIdMenu);
menuRoute.get("/getAll", menuController.getAllMenu);

module.exports = menuRoute;
