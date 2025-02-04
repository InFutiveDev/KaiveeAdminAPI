const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const subscribeModel = require("../../models/landing_subs");
const _ = require("underscore");

const getAllSubscriber = async (req, res) => {
    const { logger } = req;
    try {
      let { sortBy, str, page, limit, startDate, endDate } = req.query;
  
      let qry = {};
      if (str) {
        qry["$or"] = [
          { subsriber_email: { $regex: str, $options: "i" } }
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
      const pageData = await subscribeModel.aggregate([
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
      if (_.isEmpty(pageData[0].paginatedResult)) {
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
          pageData: pageData[0].paginatedResult,
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: pageData[0].totalCount[0].count,
          },
        },
      };
      return Response.success(obj);
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  module.exports ={
    getAllSubscriber,
  }