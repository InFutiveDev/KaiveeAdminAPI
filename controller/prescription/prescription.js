const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");

const prescriptionModel = require("../../models/prescription");
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const _ = require("underscore");


const getAllprescription = async (req, res) => {
    const { logger } = req;
    try {
      let { sortBy, str, page, limit , startDate , endDate} = req.query;
  
      let qry = {};
      if (str) {
        qry["$or"] = [
          { patient_name: { $regex: str, $options: "i" } },
          {dob:{ $regex: str, $options: "i" } },
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
      const listprescription = await prescriptionModel.aggregate([
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
      if (_.isEmpty(listprescription[0].paginatedResult)) {
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
          prescriptionData: listprescription[0].paginatedResult,
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: listprescription[0].totalCount[0].count,
          },
        },
      };
      return Response.success(obj);
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  //getby id

  const getById = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      const prescriptionData = await prescriptionModel.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(_id) },
        },
        {
          $project: {
            __v: 0,
            otp:0,
          },
        },
      ]);
      if (!prescriptionData) {
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
          data: prescriptionData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };
  

module.exports = {
    getAllprescription,
    getById,
}

