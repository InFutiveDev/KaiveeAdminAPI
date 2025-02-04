const express = require("express");
const couponRouter = express.Router();
const couponController = require("../controller/coupon/coupon");

couponRouter.post("/add", couponController.addCoupon);
couponRouter.put("/update/:id", couponController.updateCoupon);
couponRouter.delete("/delete/:id", couponController.deleteCoupon);
couponRouter.get("/getById/:id", couponController.getCouponById);
couponRouter.get("/getAll", couponController.getAllCoupon);

module.exports = couponRouter;
