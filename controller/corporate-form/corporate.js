const mongoose = require("mongoose");
const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const corporateModel = require("../../models/corporate");
const _ = require("underscore");
 


const getAllCoporate = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit, startDate , endDate } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { your_name: { $regex: str, $options: "i" } },
        { your_email: { $regex: str, $options: "i" } },
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
    const corporateData = await corporateModel.aggregate([
      {
        $match: qry,
      },
      {
        $sort:{ createdAt: -1 },
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(corporateData[0].paginatedResult)) {
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
        corporateData: corporateData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: corporateData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const deleteCorporate = async (req, res) => {
    const { logger } = req;
  
    try {
      const _id = req.params.id;
      let deleteCorporate_form = await corporateModel.findByIdAndDelete({ _id });
      if (!deleteCorporate_form) {
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
          data: deleteCorporate_form,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  module.exports = {
    getAllCoporate,
    deleteCorporate,
    
  }