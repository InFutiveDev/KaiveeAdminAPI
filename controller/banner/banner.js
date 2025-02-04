const mongoose = require("mongoose");
const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const bannerModel = require("../../models/banner");
const _ = require("underscore");
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");

const addBanner = async (req, res) => {
  const { logger } = req;

  try {
    const image = req.files.banner_image.filepath;

    // firebase logic to upload the image
    let uploaded = bucket.upload(image, {
      public: true,
      destination: `images/${
        Math.random() * 10000 + req.files.banner_image.originalFilename
      }`,
      // destination:image.filename,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
    });
    let data = await uploaded;

    const mediaLink = data[0].metadata.mediaLink;

    const saveBanner = await bannerModel.create({
      banner_name: req.data.banner_name,
      banner_image: mediaLink,
      position: req.data.position,
    });
    if (!saveBanner) {
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
        data: saveBanner,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const updateBanner = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    let updateBanner;

    if (typeof req.data.banner_image == "string") {
      
      updateBanner = await bannerModel.findByIdAndUpdate(
        { _id },
        {
          banner_name: req.data.banner_name,
          banner_image: req.data.banner_image,
          position:req.data.position,
        },
        {
          new: true,
        }
      );
    } else {
      const image = req.files.banner_image.filepath;
      // firebase logic to upload the image
      let uploaded = bucket.upload(image, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.banner_image.originalFilename
        }`,
        // destination:image.filename,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });
      let data = await uploaded;

      const mediaLink = data[0].metadata.mediaLink;

      updateBanner = await bannerModel.findByIdAndUpdate(
        { _id },
        { banner_name: req.data.banner_name, banner_image: mediaLink, position:req.data.position },
        {
          new: true,
        }
      );
    }

    if (!updateBanner) {
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
        data: updateBanner,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const deleteBanner = async (req, res) => {
  const { logger } = req;

  try {
    const _id = req.params.id;
    let deleteBanner = await bannerModel.findByIdAndDelete({ _id });
    if (!deleteBanner) {
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
        data: deleteBanner,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllBanner = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [{ banner_name: { $regex: str, $options: "i" } }];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const bannerData = await bannerModel.aggregate([
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
    if (_.isEmpty(bannerData[0].paginatedResult)) {
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
        bannerData: bannerData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: bannerData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getBannerById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    const bannerData = await bannerModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(_id) },
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);
    if (!bannerData) {
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
        data: bannerData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addBanner,
  updateBanner,
  deleteBanner,
  getAllBanner,
  getBannerById,
};
