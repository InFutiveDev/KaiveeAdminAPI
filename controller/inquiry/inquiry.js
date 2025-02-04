const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const inquiryModel = require("../../models/inquiry");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;



const deleteInquiry = async (req, res) => {
  const { logger } = req;

  try {
    const _id = req.params.id;
    let deleteInquiry = await inquiryModel.findByIdAndDelete({ _id });
    if (!deleteInquiry) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.INFO_MSGS.NO_DATA,
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.DELETED_SUCCESSFULLY,
        status: Constant.STATUS_CODE.OK,
        data: deleteInquiry,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllInquiry = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page,startDate ,endDate, limit } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { patient_name: { $regex: str, $options: "i" } },
        { patient_email: { $regex: str, $options: "i" } },
        { inquiry_from : {$regex: str, $options: "i"} },
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
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const inquiryData = await inquiryModel.aggregate([
      {
        $match: qry,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(inquiryData[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          items: [],
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
        inquiryData: inquiryData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: inquiryData[0].totalCount[0].count,
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

  deleteInquiry,
  getAllInquiry,
  
};
