const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const technicianModel = require("../../models/technician");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");
const { async } = require("crypto-random-string");


const addtechnician = async (req, res) => {
    const { logger } = req;
  
     //console.log(req);
    try {
      
      const image = req.files.technician_image.filepath;
  
      
         
    
    let uploaded = bucket.upload(image, {
    public: true,
    destination: `images/${
      Math.random() * 10000 + req.files.technician_image.originalFilename
    }`,
    
    metadata: {
      firebaseStorageDownloadTokens: uuidv4(),
    },
  });
  
  let data = await uploaded;
  
   const mediaLink = data[0].metadata.mediaLink;
      
      const savetechnician = await technicianModel.create({
        
        technician_name:req.data.technician_name,
        technician_qualification:req.data.technician_qualification,
        technician_image:mediaLink,
        technician_description:req.data.technician_description
  
      });
      if (!savetechnician) {
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
          data: savetechnician,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const updatetechnician = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      let updatetechnician={};
  
      // if (typeof req.data.team_image == "string") {
        
        if(typeof req.data.technician_image === "string" || !req.files.technician_image){
      
      

        }
        else{
         const landingImage = req.files.technician_image.filepath;
        // firebase logic to upload the image
        
          let uploaded = bucket.upload(landingImage, {
            public: true,
            destination: `images/${
              Math.random() * 10000 + req.files.technician_image.originalFilename
            }`,
        // destination:image.filename,
            metadata: {
              firebaseStorageDownloadTokens: uuidv4(),
            },
          });
          
          let data = await uploaded;
    
          const mediaLink = data[0].metadata.mediaLink;
          updatetechnician.technician_image = mediaLink
        }
  
        updatetechnician = await technicianModel.findByIdAndUpdate(
          { _id },
          {
            technician_name:req.data.technician_name,
            technician_qualification:req.data.technician_qualification,
            ...updatetechnician,
            technician_description:req.data.technician_description
          },
          {
            new: true,
          }
        );
     // }
  
      if (!updatetechnician) {
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
          data: updatetechnician,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const deletetechnician = async (req, res) => {
    const { logger } = req;
  
    try {
      const _id = req.params.id;
      let deletetechnician = await technicianModel.findByIdAndDelete({ _id });
      if (!deletetechnician) {
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
          data: deletetechnician,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const getAlltechnician = async (req, res) => {
    const { logger } = req;
    try {
      let { sortBy, str, page, limit } = req.query;
  
      let qry = {};
      if (str) {
        qry["$or"] = [{ technician_name: { $regex: str, $options: "i" } }];
      }
      offset = page || 1;
      limit = limit || 12;
      const skip = limit * (offset - 1);
      const technicianData = await technicianModel.aggregate([
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
      if (_.isEmpty(technicianData[0].paginatedResult)) {
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
          technicianData: technicianData[0].paginatedResult,
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: technicianData[0].totalCount[0].count,
          },
        },
      };
      return Response.success(obj);
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const gettechnicianById = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      const technicianData = await technicianModel.findOne({_id});
      if (!technicianData) {
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
          data: technicianData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  module.exports = {
    addtechnician,
    updatetechnician,
    deletetechnician,
    getAlltechnician,
    gettechnicianById,  
  }
  