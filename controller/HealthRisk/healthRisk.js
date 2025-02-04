const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const healthRiskModel = require("../../models/healthRisk");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");

const addHealthRisk = async (req, res) => {
  const { logger } = req;

  try {
    // const healthRiskData = req.body;
    const healthRisk_image = req.files.healthRisk_image.filepath;
    const { description, healthRiskTitle ,healthRisk_image_alt} = req.data;

    // firebase logic to upload the image
    let uploaded = bucket.upload(healthRisk_image, {
      public: true,
      destination: `images/${
        Math.random() * 10000 + req.files.healthRisk_image.originalFilename
      }`,
      // destination:image.filename,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
    });
    let data = await uploaded;

    const mediaLink = data[0].metadata.mediaLink;

    const saveHealthRiskData = await healthRiskModel.create({
      healthRisk_image: mediaLink,
      healthRisk_image_alt,
      description,
      healthRiskTitle,
    });
    if (!saveHealthRiskData) {
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
        data: saveHealthRiskData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllHealthRisk = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [{ healthRiskTitle: { $regex: str, $options: "i" } }];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const healthRiskData = await healthRiskModel.aggregate([
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
    if (_.isEmpty(healthRiskData[0].paginatedResult)) {
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
        healthRiskData: healthRiskData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: healthRiskData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const updateHealthRisk = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    let updateHealthData;
    // console.log("req.files--->", req.files);

    if (typeof req.data.healthRisk_image == "string") {
      console.log("str");
      // console.log("String Type",req.data.healthRisk_image);
      const { description, healthRiskTitle, healthRisk_image,healthRisk_image_alt } = req.data;
      updateHealthData = await healthRiskModel.findByIdAndUpdate(
        { _id },
        {
          healthRiskTitle,
          description,
          healthRisk_image,
          healthRisk_image_alt,
        },
        {
          new: true,
        }
      );
    } else {
      const healthRisk_image = req.files.healthRisk_image.filepath;
      const { description, healthRiskTitle,healthRisk_image_alt } = req.data;
      // firebase logic to upload the image
      let uploaded = bucket.upload(healthRisk_image, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.healthRisk_image.originalFilename
        }`,
        // destination:image.filename,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });
      let data = await uploaded;

      const mediaLink = data[0].metadata.mediaLink;
      updateHealthData = await healthRiskModel.findByIdAndUpdate(
        { _id },
        {
          healthRiskTitle,
          description,
          healthRisk_image: mediaLink,
          healthRisk_image_alt,
        },
        {
          new: true,
        }
      );
    }

    if (!updateHealthData) {
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
        data: updateHealthData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const deleteHealthRisk = async (req, res) => {
  const { logger } = req;

  try {
    const _id = req.params.id;
    let deletehealthRisk = await healthRiskModel.findByIdAndDelete({ _id });
    if (!deletehealthRisk) {
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
        data: deletehealthRisk,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getHealthRiskById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    const healthRiskData = await healthRiskModel.find({_id: mongoose.Types.ObjectId(_id)})
    if (!healthRiskData) {
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
        data: healthRiskData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addHealthRisk,
  getAllHealthRisk,
  updateHealthRisk,
  deleteHealthRisk,
  getHealthRiskById,
};