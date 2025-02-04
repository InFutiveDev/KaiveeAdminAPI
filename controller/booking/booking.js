
const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const bookingModel = require("../../models/booking");
const couponModel = require("../../models/coupon");
const testModel = require("../../models/test");
const mongoose = require("mongoose");
const _ = require("underscore");
const { string } = require("joi");
const { ObjectId } = mongoose.Types;


const getAllBooking = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit ,startDate ,endDate,paid} = req.query;

    let qry = {};
    if(str){
      qry["$or"] = [
        { labAddress: { $regex: str, $options: "i" } },
        { collectionType: { $regex: str, $options: "i" } },
        { paymentType : { $regex: str, $options: "i" } },
       
      ];
    }
    if (startDate && endDate) {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      endDate.setDate(endDate.getDate() + 1);
      qry["$and"] = [
        { createdAt: { $gt: startDate } },
        { createdAt: { $lt: endDate } },
      ];
    }
    if(paid=== "true"){
      qry["$or"] = [
        { is_paid:true},
      ];
    }
    if(paid=== "false"){
      qry["$or"] = [
        { is_paid:false},
      ];
    }

    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const bookingData = await bookingModel.aggregate([
      {
        $match:qry,
      },
      {
        $sort: {sampleCollectionDateTime :-1} ,
      },
      {
        $lookup: {
          from: "tests",
          localField: "testId",
          foreignField: "_id",
          as: "testData",
        },
      },
      {
        $unwind: { path: "$testData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "familymembers",
          localField: "memberId",
          foreignField: "_id",
          as: "memberData",
        },
      },
      {
        $unwind: { path: "$memberData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: { path: "$userData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "addresses",
          localField: "address",
          foreignField: "_id",
          as: "addressData",
        },
      },
      {
        $unwind: { path: "$addressData", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          userId: 1,
          userEmail: "$userData.email.id",
          userMobile: "$userData.email.mobile",
          userName: "$userData.name",
          addressData: "$addressData",
          address: 1,
          sampleCollectionDateTime: {
            $cond: { if: { $eq: ["$sampleCollectionDateTime", null] }, then: " ", else: "$sampleCollectionDateTime" }},
          timeslot:1,
          testId:1,
          testData: "$testData",
          memberId:1,
          memberData: "$memberData",
          paymentAmount: 1,
          is_paid:1,
          id:1,
          createdAt:1,
          paymentType:1
        },
      },
      {
        $sort: {createdAt :-1} ,
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(bookingData[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          bookingData: [],
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: 0,
          },
        },
      };
      return Response.success(obj);
    }
    obj = {
      res,
      msg: Constant.INFO_MSGS.SUCCESS,
      status: Constant.STATUS_CODE.OK,
      data: {
        bookingData: bookingData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: bookingData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};


const getBookingById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    const bookingData = await bookingModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(_id) },
      },
      {
        $lookup: {
          from: "tests",
          localField: "testId",
          foreignField: "_id",
          as: "testData",
        },
      },
      {
        $unwind: { path: "$testData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "familymembers",
          localField: "memberId",
          foreignField: "_id",
          as: "memberData",
        },
      },
      {
        $unwind: { path: "$memberData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "users",
          localField: "userID",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: { path: "$userData", preserveNullAndEmptyArrays: true },
      },
       {
        $lookup: {
          from: "addresses",
          localField: "address",
          foreignField: "_id",
          as: "addressData",
        },
      },
      {
        $unwind: { path: "$addressData", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          userId: 1,
          userData: "$userData",
          addressData: "$addressData",
          address: 1,
          sampleCollectionDateTime: 1,
          timeslot:1,
          testId:1,
          testData: "$testData",
          memberId:1,
          memberData: "$memberData",
          paymentAmount: 1,
          collectionType:1,
          id:1,
          createdAt:1
        },
      },
    ]);
    if (!bookingData) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.DATA_NOT_FOUND,
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.SUCCESS,
        status: Constant.STATUS_CODE.OK,
        data: bookingData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};


const updatepayementStatus = async (req, res) => {
  const { logger } = req;
  try {
    const _id = (req.params.id);
   
    let updateStatus = await bookingModel.findByIdAndUpdate({ _id },req.body,{
      new: true,
    });
    if (updateStatus.is_paid === false) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.UPDATED_SUCCESSFULLY+"unpaid",
        data:updateStatus,
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.UPDATED_SUCCESSFULLY+ " paid",
        status: Constant.STATUS_CODE.OK,
        data: updateStatus,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};


module.exports = {
  getAllBooking,
  getBookingById,
  updatepayementStatus,
};
