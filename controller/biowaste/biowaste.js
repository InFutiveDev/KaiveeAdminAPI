const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const biowasteModel = require("../../models/biowaste");
const mongoose = require("mongoose");
const _ = require("underscore");

const addbiowaste = async(req,res)=>{
    const {logger} =req;
    
    try{
        const saveWaste = await biowasteModel.insertMany(req.body);
          if (!saveWaste) {
            const obj = {
              res,
              status: Constant.STATUS_CODE.BAD_REQUEST,
              msg: Constant.ERROR_MSGS.CREATE_ERR,
            };
            return Response.error(obj);
          } else {
            const obj = {
              res,
              msg: Constant.INFO_MSGS.CREATED_SUCCESSFULLY,
              status: Constant.STATUS_CODE.OK,
              data: saveWaste,
            };
            return Response.success(obj);
          }
        

    }catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
   
};

const updatewaste = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
     
      let updatewaste = await biowasteModel.findByIdAndUpdate({ _id },req.body,{
        new: true,
      });
      if (!updatewaste) {
        const obj = {
          res,
          status: Constant.STATUS_CODE.BAD_REQUEST,
          msg: Constant.INFO_MSGS.NO_DATA,
        };
        return Response.error(obj);
      } else {
        const obj = {
          res,
          msg: Constant.INFO_MSGS.UPDATED_SUCCESSFULLY,
          status: Constant.STATUS_CODE.OK,
          data: updatewaste,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const deletewaste = async (req, res) => {
    const { logger } = req;
  
    try {
      const _id = req.params.id;
      let deletewaste = await biowasteModel.findByIdAndDelete({ _id });
      if (!deletewaste) {
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
          data: deletewaste,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const getbiowasteByMonth = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      //const testData = await testModel.find({_id: mongoose.Types.ObjectId(_id)});
      const wasteData = await biowasteModel.aggregate([
        {
          $match: { 
            
            months : _id 
          },
        },
      ]);
      if (!wasteData) {
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
          data: wasteData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  
  const getAllwaste = async (req, res) => {
    const { logger } = req;
    try {
      let { sortBy,  str,page, limit } = req.query;
      let qry = {};
      if (str) {
        qry["$or"] = [
          { centre_name: { $regex: str, $options: "i" } },
          
        ];
      }
  
     
      offset = page || 1;
      limit = limit || 20;
      const skip = limit * (offset - 1);
      const wasteData = await biowasteModel.aggregate([
        {
          $match: qry,
        },
        {
          $sort: { createdAt: -1 } ,
        },
        {
          $facet: {
            paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
            totalCount: [{ $count: "count" }],
          },
        },
      ]);
      if (_.isEmpty(wasteData[0].paginatedResult)) {
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
          wasteData: wasteData[0].paginatedResult,
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: wasteData[0].totalCount[0].count,
          },
        },
      };
      return Response.success(obj);
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };
  const getbiowasteById = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      const biowasteData = await biowasteModel.find({_id: mongoose.Types.ObjectId(_id)})
      if (!biowasteData) {
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
          data: biowasteData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };
  
module.exports = {
    addbiowaste,
    updatewaste,
    deletewaste,
    getAllwaste,
    getbiowasteByMonth,
    getbiowasteById,
    
}

