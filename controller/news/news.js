const mongoose = require("mongoose");
const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const newsModel = require("../../models/news");
const _ = require("underscore");
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");

const addNews = async (req, res) => {
    const { logger } = req;
  
    try {
      const image = req.files.news_thumbnail.filepath;
  
      // firebase logic to upload the image
      let uploaded = bucket.upload(image, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.news_thumbnail.originalFilename
        }`,
        //destination file name
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });
      let data = await uploaded;
  
      const mediaLink = data[0].metadata.mediaLink;
  
      const saveNews = await newsModel.create({
        news_name:req.data.news_name,
        news_category: req.data.news_category,
        news_date: req.data.news_date,
        news_thumbnail: mediaLink,
        news_status: req.data.news_status,
        link1:req.data.link1,
        link1_name : req.data.link1_name,
        link2: req.data.link2,
        link2_name: req.data.link2_name,
        link3: req.data.link3,
        link3_name:req.data.link3_name,
        link4:req.data.link4,
        link4_name:req.data.link4_name,
        link5:req.data.link5,
        link5_name:req.data.link5_name,
        news_description:req.data.news_description
      });
      if (!saveNews) {
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
          data: saveNews,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const updateNews = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      let updateNews;
  
      if (typeof req.data.news_thumbnail == "string") {
        updateNews = await newsModel.findByIdAndUpdate(
          { _id },
          {
            news_name:req.data.news_name,
            news_category: req.data.news_category,
            news_date: req.data.news_date,
            news_thumbnail: mediaLink,
            news_status: req.data.news_status,
            link1:req.data.link1,
            link1_name : req.data.link1_name,
            link2: req.data.link2,
            link2_name: req.data.link2_name,
            link3: req.data.link3,
            link3_name:req.data.link3_name,
            link4:req.data.link4,
            link4_name:req.data.link4_name,
            link5:req.data.link5,
            link5_name:req.data.link5_name,
            news_description:req.data.news_description
          },
          {
            new: true,
          }
        );
      } else {
        const image = req.files.news_thumbnail.filepath;
        // firebase logic to upload the image
        let uploaded = bucket.upload(image, {
          public: true,
          destination: `images/${
            Math.random() * 10000 + req.files.news_thumbnail.originalFilename
          }`,
          // destination:image.filename,
          metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
          },
        });
        let data = await uploaded;
  
        const mediaLink = data[0].metadata.mediaLink;
  
        updateNews = await newsModel.findByIdAndUpdate(
          { _id },
          {
            news_name:req.data.news_name,
            news_category: req.data.news_category,
            news_date: req.data.news_date,
            news_thumbnail: mediaLink,
            news_status: req.data.news_status,
            link1:req.data.link1,
            link1_name : req.data.link1_name,
            link2: req.data.link2,
            link2_name: req.data.link2_name,
            link3: req.data.link3,
            link3_name:req.data.link3_name,
            link4:req.data.link4,
            link4_name:req.data.link4_name,
            link5:req.data.link5,
            link5_name:req.data.link5_name,
            news_description:req.data.news_description
           },
          {
            new: true,
          }
        );
      }
  
      if (!updateNews) {
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
          data: updateNews,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const deleteNews = async (req, res) => {
    const { logger } = req;
  
    try {
      const _id = req.params.id;
      let deleteNews = await newsModel.findByIdAndDelete({ _id });
      if (!deleteNews) {
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
          data: deleteNews,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const getAllNews = async (req, res) => {
    const { logger } = req;
    try {
      let { sortBy, str, page, limit } = req.query;
  
      let qry = {};
      if (str) {
        qry["$or"] = [{ news_name: { $regex: str, $options: "i" } }];
      }
      offset = page || 1;
      limit = limit || 20;
      const skip = limit * (offset - 1);
      const newsData = await newsModel.aggregate([
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
      if (_.isEmpty(newsData[0].paginatedResult)) {
        obj = {
          res,
          status: Constant.STATUS_CODE.OK,
          msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
          data: {
            newsData: [],
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
          newsData: newsData[0].paginatedResult,
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: newsData[0].totalCount[0].count,
          },
        },
      };
      return Response.success(obj);
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const getNewsById = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      const newsData = await newsModel.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(_id) },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ]);
      if (!newsData) {
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
          data: newsData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };


  module.exports = {
    addNews,
    updateNews,
    deleteNews,
    getAllNews,
    getNewsById
  }