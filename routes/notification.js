const express = require("express");
const notificationsRoute = express.Router();
const notificationsController = require("../controller/notification/notification");



notificationsRoute.post("/create-notification", notificationsController.createNotification);
notificationsRoute.post("/create-notification/bulk", notificationsController.sendBulkNotification);
notificationsRoute.get("/get", notificationsController.getAllNotifications);
notificationsRoute.delete("/delete/:id", notificationsController.deleteNotification);

notificationsRoute.post("/category", notificationsController.createCategory);
notificationsRoute.get("/category", notificationsController.getCategories);
notificationsRoute.put("/category/:id", notificationsController.updateCategory);
notificationsRoute.delete("/category-delete/:id", notificationsController.deleteCategory);


module.exports = notificationsRoute;