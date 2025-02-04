const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const hebitModel = require("../../models/hebit");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");

const addHebit = async (req, res) => {
  const { logger } = req;

  try {
    // const hebitData = req.body;
    const hebit_image = req.files.hebit_image.filepath;
    const { description, hebitName,hebit_image_alt } = req.data;

    // firebase logic to upload the image
    let uploaded = bucket.upload(hebit_image, {
      public: true,
      destination: `images/${
        Math.random() * 10000 + req.files.hebit_image.originalFilename
      }`,
      // destination:image.filename,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
    });
    let data = await uploaded;

    const mediaLink = data[0].metadata.mediaLink;

    const saveHebitData = await hebitModel.create({
      hebit_image: mediaLink,
      hebit_image_alt,
      description,
      hebitName,
    });
    if (!saveHebitData) {
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
        data: saveHebitData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllHebit = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [{ hebitName: { $regex: str, $options: "i" } }];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const hebitData = await hebitModel.aggregate([
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
    if (_.isEmpty(hebitData[0].paginatedResult)) {
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
        hebitData: hebitData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: hebitData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const updateHebit = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    let updateHebit;
    const { description, hebitName, hebit_image_alt } = req.data;
    if (typeof req.data.hebit_image == "string") {
      updateHebit = await hebitModel.findByIdAndUpdate(
        { _id },
        {
          hebitName,
          description,
          hebit_image: req.data.hebit_image,
          hebit_image_alt,
        },
        {
          new: true,
        }
      );
    } else {
      const hebit_image = req.files.hebit_image.filepath;
      const { description, hebitName,hebit_image_alt } = req.data;
      // firebase logic to upload the image
      let uploaded = bucket.upload(hebit_image, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.hebit_image.originalFilename
        }`,
        // destination:image.filename,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });
      let data = await uploaded;

      const mediaLink = data[0].metadata.mediaLink;

      updateHebit = await hebitModel.findByIdAndUpdate(
        { _id },
        {
          hebitName,
          description,
          hebit_image: mediaLink,
          hebit_image_alt,
        },
        {
          new: true,
        }
      );
    }
    if (!updateHebit) {
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
        data: updateHebit,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const deleteHebit = async (req, res) => {
  const { logger } = req;

  try {
    const _id = req.params.id;
    let deletehealthRisk = await hebitModel.findByIdAndDelete({ _id });
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

const getHebitById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    const healthRiskData = await hebitModel.find({_id: mongoose.Types.ObjectId(_id)});
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
  addHebit,
  updateHebit,
  deleteHebit,
  getHebitById,
  getAllHebit,
};