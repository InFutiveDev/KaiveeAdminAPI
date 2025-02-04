const express = require("express");
const bookingRouter = express.Router();
const bookingController = require("../controller/booking/booking");

bookingRouter.get("/getAll", bookingController.getAllBooking);
bookingRouter.get("/get-by-id/:id", bookingController.getBookingById);
bookingRouter.put("/status/:id",bookingController.updatepayementStatus);

module.exports = bookingRouter;
