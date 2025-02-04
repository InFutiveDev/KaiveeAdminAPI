const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const feedsModel = require("../../models/newfeeds");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;



const deletefeedback = async (req, res) => {
  const { logger } = req;

  try {
    const _id = req.params.id;
    let deletefeeds = await feedsModel.findByIdAndDelete({ _id });
    if (!deletefeedback) {
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
        data: deletefeedback,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllFeeds = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { first_name: { $regex: str, $options: "i" } },
        { email_id: { $regex: str, $options: "i" } },
      ];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const feedbackData = await feedsModel.aggregate([
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
    if (_.isEmpty(feedbackData[0].paginatedResult)) {
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
        feedbackData: feedbackData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: feedbackData[0].totalCount[0].count,
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

  deletefeedback,
  getAllFeeds,
  
};
