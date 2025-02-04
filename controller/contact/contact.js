const mongoose = require("mongoose");
const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const contactModel = require("../../models/contact");
const _ = require("underscore");

const getAllContactList = async (req, res) => {
    const { logger } = req;
    try {
      let { sortBy, str,int, page, limit , startDate , endDate  } = req.query;
  
      let qry = {};
      if (str) {
        qry["$or"] = [
          { first_name: { $regex: str, $options: "i" } },
          { emailId: { $regex: str, $options: "i" } },
        
          
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
      const contactData = await contactModel.aggregate([
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
      if (_.isEmpty(contactData[0].paginatedResult)) {
        obj = {
          res,
          status: Constant.STATUS_CODE.OK,
          msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
          data: {
            contactDataData: [],
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
          contactList: contactData[0].paginatedResult,
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: contactData[0].totalCount[0].count,
          }, 
        },
      };
      return Response.success(obj);
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };
  
  const getContactById = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      const contactData = await contactModel.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(_id) ,},
        },
        {
          $project: {
            __v: 0,
            
            
          },
        },
      ]);
      if (!contactData) {
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
          data: contactData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  module.exports ={
    getAllContactList,
    getContactById,
  }