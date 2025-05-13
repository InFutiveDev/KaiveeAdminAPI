const express = require("express");
const notificationsRoute = express.Router();
const notificationsController = require("../controller/notification/notification");



notificationsRoute.post("/add", notificationsController.addNotification);
notificationsRoute.put("/update/:id", notificationsController.updateNotification);
notificationsRoute.delete("/delete/:id", notificationsController.deleteNotification);
notificationsRoute.get("/getnotification", notificationsController.getEnabledNotifications);
notificationsRoute.get("/getnotification/user/:userId", notificationsController.getNotificationsByUserId);


module.exports = notificationsRoute;