const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const covidModel = require("../../models/covid");
const mongoose = require("mongoose");
const _ = require("underscore");
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");



const addcovidData = async (req, res) => {
    const { logger } = req;
  
    try { 


      const document = req.files.documents.filepath;
       
        // firebase 
        let uploaded = bucket.upload(document, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.documents.originalFilename
        }`,
        
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      
      });
  
      const data = await uploaded;
    

      const mediaLink = data[0].metadata.mediaLink;
    
      const savecovidData = await covidModel.create({
            patientName : req.data.patientName,
            testType: req.data.testType,
            transactionId : req.data.transactionId,
            age: req.data.age,
            dateOfBirth : req.data.dateOfBirth,
            gender: req.data.gender,
            address: req.data.address,
            city: req.data.city,
            state: req.data.state,
            postal_code: req.data.postal_code,
            nationality : req.data.nationality,
            phone : req.data.phone,
            whatsapp: req.data.whatsapp,
            email : req.data.email,
            dateOfSample: req.data.dateOfSample,
            prefferedTime: req.data.prefferedTime,
            documents:mediaLink,
            paidStatus:req.data.paidStatus
      });
      if (!savecovidData) {
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
          data: savecovidData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  //delete

  const deleteCovidData = async (req, res) => {
    const { logger } = req;
  
    try {
      const _id = req.params.id;
      let deleteCovid = await covidModel.findByIdAndDelete({ _id });
      if (!deleteCovid) {
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
          data: deleteCovid,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  //get

  
const getAllCovidData = async (req, res) => {
    const { logger } = req;
    try {
      let { sortBy, str, page, limit } = req.query;
  
      let qry = {};
      if (str) {
        qry["$or"] = [
          { patientName: { $regex: str, $options: "i" } },
          { email: { $regex: str, $options: "i" } },
        ];
      }
      offset = page || 1;
      limit = limit || 20;
      const skip = limit * (offset - 1);
      const covidData = await covidModel.aggregate([
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
      if (_.isEmpty(covidData[0].paginatedResult)) {
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
          covidData: covidData[0].paginatedResult,
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: covidData[0].totalCount[0].count,
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
    addcovidData,
    deleteCovidData,
    getAllCovidData,
  };