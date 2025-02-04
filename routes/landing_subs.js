const express = require("express");
const subscribeRoute = express.Router();
const landing_subscriber = require("../controller/landing_subs/subscriber");


subscribeRoute.get("/getAll",landing_subscriber.getAllSubscriber);

module.exports = subscribeRoute;