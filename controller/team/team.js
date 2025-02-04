const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const teamModel = require("../../models/team");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");
const { async } = require("crypto-random-string");
const team = require("../../models/team");

const addteam = async (req, res) => {
    const { logger } = req;
  
     //console.log(req);
    try {
      
      const image = req.files.team_image.filepath;
  
      
         
    
    let uploaded = bucket.upload(image, {
    public: true,
    destination: `images/${
      Math.random() * 10000 + req.files.team_image.originalFilename
    }`,
    
    metadata: {
      firebaseStorageDownloadTokens: uuidv4(),
    },
  });
  
  let data = await uploaded;
  
   const mediaLink = data[0].metadata.mediaLink;
      
      const saveteam = await teamModel.create({
        
        team_name:req.data.team_name,
        team_qualification:req.data.team_qualification,
        team_image:mediaLink,
        team_description:req.data.team_description
  
      });
      if (!saveteam) {
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
          data: saveteam,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const updateteam = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      let updateteam={};
  
      // if (typeof req.data.team_image == "string") {
        
        if(typeof req.data.team_image === "string" || !req.files.team_image){
      
      

        }
        else{
         const landingImage = req.files.team_image.filepath;
        // firebase logic to upload the image
        
          let uploaded = bucket.upload(landingImage, {
            public: true,
            destination: `images/${
              Math.random() * 10000 + req.files.team_image.originalFilename
            }`,
        // destination:image.filename,
            metadata: {
              firebaseStorageDownloadTokens: uuidv4(),
            },
          });
          
          let data = await uploaded;
    
          const mediaLink = data[0].metadata.mediaLink;
          updateteam.team_image = mediaLink
        }
  
        updateteam = await teamModel.findByIdAndUpdate(
          { _id },
          {
            team_name:req.data.team_name,
            team_qualification:req.data.team_qualification,
            ...updateteam,
            team_description:req.data.team_description
          },
          {
            new: true,
          }
        );
     // }
  
      if (!updateteam) {
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
          data: updateteam,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const deleteteam = async (req, res) => {
    const { logger } = req;
  
    try {
      const _id = req.params.id;
      let deleteteam = await teamModel.findByIdAndDelete({ _id });
      if (!deleteteam) {
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
          data: deleteteam,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const getAllteam = async (req, res) => {
    const { logger } = req;
    try {
      let { sortBy, str, page, limit } = req.query;
  
      let qry = {};
      if (str) {
        qry["$or"] = [{ team_name: { $regex: str, $options: "i" } }];
      }
      offset = page || 1;
      limit = limit || 12;
      const skip = limit * (offset - 1);
      const teamData = await teamModel.aggregate([
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
      if (_.isEmpty(teamData[0].paginatedResult)) {
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
          teamData: teamData[0].paginatedResult,
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: teamData[0].totalCount[0].count,
          },
        },
      };
      return Response.success(obj);
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const getteamById = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      const teamData = await teamModel.findOne({_id});
      if (!teamData) {
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
          data: teamData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  module.exports = {
    addteam,
    updateteam,
    deleteteam,
    getAllteam,
    getteamById,
  }
  