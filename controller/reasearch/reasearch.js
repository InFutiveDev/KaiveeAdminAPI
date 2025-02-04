const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const reasearchModel = require("../../models/reasearch");
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const _ = require("underscore");

const addreasearch = async(req,res)=>{
    const{logger} = req;
   // console.log(req);
    try{
        const reasearch = req.files.reasearchfile.filepath;

    // firebase logic to upload the image
    let uploaded = bucket.upload(reasearch, {
      public: true,
      destination: `images/${
        Math.random() * 10000 + req.files.reasearchfile.filepath
      }`,
      
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
    });
    let data = await uploaded;

    

    const mediaLink = data[0].metadata.mediaLink;
        const savereasearch = await reasearchModel.create({
            reasearchname:req.data.reasearchname,
            reasearchfile:mediaLink,
        });
        if (!savereasearch) {
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
              data: savereasearch,
            };
            return Response.success(obj);
          }
        } catch (error) {
          console.log("error", error);
          return handleException(logger, res, error);
        }
};

const updatereasearch = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      let updatereasearch;
  
      if (typeof req.data.reasearchfile == "string") {
        
        updatereasearch = await reasearchModel.findByIdAndUpdate(
          { _id },
          {
            reasearchname: req.data.reasearchname,
            reasearchfile: req.data.reasearchfile,
          },
          {
            new: true,
          }
        );
      } else {
        const image = req.files.reasearchfile.filepath;
        // firebase logic to upload the image
        let uploaded = bucket.upload(image, {
          public: true,
          destination: `images/${
            Math.random() * 10000 + req.files.reasearchfile.originalFilename
          }`,
          // destination:image.filename,
          metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
          },
        });
        let data = await uploaded;
  
        const mediaLink = data[0].metadata.mediaLink;
  
        updatereasearch = await reasearchModel.findByIdAndUpdate(
          { _id },
          { reasearchname: req.data.reasearchname, 
            reasearchfile: mediaLink },
          {
            new: true,
          }
        );
      }
  
      if (!updatereasearch) {
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
          data: updatereasearch,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const deletereasearch = async (req, res) => {
    const { logger } = req;
  
    try {
      const _id = req.params.id;
      let deletereasearch = await reasearchModel.findByIdAndDelete({ _id });
      if (!deletereasearch) {
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
          data: deletereasearch,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const getAllreasearch = async (req, res) => {
    const { logger } = req;
    try {
      let { sortBy, str, page, limit } = req.query;
  
      let qry = {};
      if (str) {
        qry["$or"] = [{ reasearchname: { $regex: str, $options: "i" } }];
      }
      offset = page || 1;
      limit = limit || 20;
      const skip = limit * (offset - 1);
      const reasearchData = await reasearchModel.aggregate([
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
      if (_.isEmpty(reasearchData[0].paginatedResult)) {
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
          reasearchData: reasearchData[0].paginatedResult,
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: reasearchData[0].totalCount[0].count,
          },
        },
      };
      return Response.success(obj);
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const getReasearchById = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      const reasearchData = await reasearchModel.findOne({_id:_id});
      if (!reasearchData) {
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
          data: reasearchData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };


module.exports = {
  addreasearch,
  updatereasearch,
  deletereasearch,
  getAllreasearch,
  getReasearchById,
};
