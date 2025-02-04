const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const awardModel = require("../../models/awards");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");
const { async } = require("crypto-random-string");

const addaward = async (req, res) => {
    const { logger } = req;
  
     //console.log(req);
    try {
      
      const image = req.files.awardfile.filepath;
  
      
         
    
    let uploaded = bucket.upload(image, {
    public: true,
    destination: `images/${
      Math.random() * 10000 + req.files.awardfile.originalFilename
    }`,
    
    metadata: {
      firebaseStorageDownloadTokens: uuidv4(),
    },
  });
  
  let data = await uploaded;
  
   const mediaLink = data[0].metadata.mediaLink;
      
      const saveaward = await awardModel.create({
        
        awardTitle:req.data.awardTitle,
        awardDescription:req.data.awardDescription,
        awardfile:mediaLink
  
      });
      if (!saveaward) {
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
          data: saveaward,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const updateaward = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      let updateaward;
  
      if (typeof req.data.awardfile == "string") {
        
        updateaward = await awardModel.findByIdAndUpdate(
          { _id },
          {
            awardTitle:req.data.awardTitle,
            awardDescription:req.data.awardDescription,
            awardfile:req.data.awardfile,
          },
          {
            new: true,
          }
        );
      } else {
        const image = req.files.awardfile.filepath;
        // firebase logic to upload the image
        let uploaded = bucket.upload(image, {
          public: true,
          destination: `images/${
            Math.random() * 10000 + req.files.awardfile.originalFilename
          }`,
          // destination:image.filename,
          metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
          },
        });
        let data = await uploaded;
  
        const mediaLink = data[0].metadata.mediaLink;
  
        updateaward = await awardModel.findByIdAndUpdate(
          { _id },
          {
             awardTitle:req.data.awardTitle,
             awardDescription:req.data.awardDescription,
             awardfile:mediaLink,
          },
          {
            new: true,
          }
        );
      }
  
      if (!updateaward) {
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
          data: updateaward,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const deleteaward = async (req, res) => {
    const { logger } = req;
  
    try {
      const _id = req.params.id;
      let deleteaward = await awardModel.findByIdAndDelete({ _id });
      if (!deleteaward) {
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
          data: deleteaward,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const getAllaward = async (req, res) => {
    const { logger } = req;
    try {
      let { sortBy, str, page, limit } = req.query;
  
      let qry = {};
      if (str) {
        qry["$or"] = [{ awardTitle: { $regex: str, $options: "i" } }];
      }
      offset = page || 1;
      limit = limit || 20;
      const skip = limit * (offset - 1);
      const awardData = await awardModel.aggregate([
        {
          $match: qry,
        },
        {
          $facet: {
            paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
            totalCount: [{ $count: "count" }],
          },
        },
      ]);
      if (_.isEmpty(awardData[0].paginatedResult)) {
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
          awardData: awardData[0].paginatedResult,
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: awardData[0].totalCount[0].count,
          },
        },
      };
      return Response.success(obj);
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const getawardById = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      const awardData = await awardModel.findOne({_id:_id});
      if (!awardData) {
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
          data: awardData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  module.exports = {
    addaward,
    updateaward,
    deleteaward,
    getAllaward,
    getawardById,
  }
  