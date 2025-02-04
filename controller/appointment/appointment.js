const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const appointmentModel = require("../../models/appointment");
const userModel = require("../../models/user");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;

const getAllappointment = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, int, page, limit, startDate, endDate } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { appointment_date: { $regex: str, $options: "i" } },
        { "memberData.fullName": { $regex: str, $options: "i" } },
        { "labData.branch_Name": { $regex: str, $options: "i" } },
        { "memberData.phone": parseInt(str) },
        { "addressData.address1": { $regex: str, $options: "i" } },
      ];
    }
    if (startDate && endDate) {
      startDate = new Date(startDate);
      endDate = new Date(endDate);
      endDate.setDate(endDate.getDate() + 1);
      qry["$and"] = [
        { createdAt: { $gte: startDate } },
        { createdAt: { $lte: endDate } },
      ];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const appointmentData = await appointmentModel.aggregate([
      {
        $sort: { appointmentId: -1 },
      },
      {
        $match: qry,
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
        $lookup: {
          from: "labs",
          localField: "nearest_centre",
          foreignField: "_id",
          as: "labData",
        },
      },
      {
        $unwind: { path: "$labData", preserveNullAndEmptyArrays: true },
      },

      {
        $project: {
          userId: 1,
          username: "$userData.name",
          memberId: "$memberData.fullName",
          memberPhone: "$memberData.phone",
          memberGender: "$memberData.gender",
          address: "$addressData.address1",
          addressPincode: "$addressData.postCode",
          labData: "$labData.branch_Name",
          appointment_date: 1,
          user_mobile: 1,
          time: 1,
          message_box: 1,
          createdAt: 1,
        },
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(appointmentData[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          appointmentData: [],
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
        appointmentList: appointmentData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: appointmentData[0].totalCount[0]
            ? appointmentData[0].totalCount[0].count
            : 0,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  getAllappointment,
};
