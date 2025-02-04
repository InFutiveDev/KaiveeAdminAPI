const mongoose = require("mongoose");
const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const careerModel = require("../../models/career");
const _ = require("underscore");

const addCarrer = async(req,res)=>{
      const{logger} = req;
      try{
          const{
            job_title,
            job_posted,
            Address_1,
            job_Type_1,
            job_Type_2,
            Address_2,
            Contact_No,
            Experience_Requirement,
            Job_Description,
            Job_Status,
            Openings,
            job_title_url
          } = req.body;
          const savecarrer = await careerModel.create({
            job_title,
            job_posted,
            Address_1,
            job_Type_1,
            job_Type_2,
            Address_2,
            Contact_No,
            Experience_Requirement,
            Job_Description,
            Job_Status,
            Openings,
            job_title_url
          });
          if (!savecarrer) {
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
                data: savecarrer,
              };
              return Response.success(obj);
            }
          } catch (error) {
            console.log("error", error);
            return handleException(logger, res, error);
          }
  };


const getAllCareer = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit, startDate , endDate } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { job_title: { $regex: str, $options: "i" } },
        { job_Type_1: { $regex: str, $options: "i" } },
        { job_Type_2: { $regex: str, $options: "i" } },
        { Job_Status: { $regex: str, $options: "i" } }
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
    const careerData = await careerModel.aggregate([
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
    if (_.isEmpty(careerData[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          careerData: [],
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
        careerData: careerData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: careerData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const updateCarrer = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
   
    let updatecarrer = await careerModel.findByIdAndUpdate({ _id },req.body,{
      new: true,
    });
    if (!updatecarrer) {
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
        data: updatecarrer,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};


const deleteCarrer = async (req, res) => {
  const { logger } = req;

  try {
    const _id = req.params.id;
    let deletecarrer = await careerModel.findByIdAndDelete({ _id });
    if (!deletecarrer) {
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
        data: deletecarrer,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getByIdCarrer = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    const CareerData = await careerModel.findById(_id)
    if (!CareerData) {
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
        data: CareerData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};




module.exports = {
  addCarrer,
  getAllCareer,
  updateCarrer,
  deleteCarrer,
  getByIdCarrer,
};
