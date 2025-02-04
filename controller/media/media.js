const mongoose = require("mongoose");
const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const mediaModel = require("../../models/media");
const _ = require("underscore");
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");

const addMedia = async (req, res) => {
  const { logger } = req;

  try {
    const image = req.files.media.filepath;

    // firebase logic to upload the image
    let uploaded = bucket.upload(image, {
      public: true,
      destination: `images/${
        Math.random() * 10000 + req.files.media.originalFilename
      }`,
      // destination:image.filename,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
    });
    let data = await uploaded;

    const mediaLink = data[0].metadata.mediaLink;

    const saveMedia = await mediaModel.create({
      media: mediaLink,
      link: req.data.link,
      text: req.data.text,
    });
    if (!saveMedia) {
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
        data: saveMedia,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const updateMedia = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    let updateMedia;

    if (typeof req.data.media == "string") {
      updateMedia = await mediaModel.findByIdAndUpdate(
        { _id },
        {
          media: req.data.media,
          link: req.data.link,
          text: req.data.text,
        },
        {
          new: true,
        }
      );
    } else {
      const image = req.files.media.filepath;
      // firebase logic to upload the image
      let uploaded = bucket.upload(image, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.media.originalFilename
        }`,
        // destination:image.filename,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });
      let data = await uploaded;

      const mediaLink = data[0].metadata.mediaLink;

      updateMedia = await mediaModel.findByIdAndUpdate(
        { _id },
        { media: mediaLink, link: req.data.link, text: req.data.text },
        {
          new: true,
        }
      );
    }

    if (!updateMedia) {
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
        data: updateMedia,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const deleteMedia = async (req, res) => {
  const { logger } = req;

  try {
    const _id = req.params.id;
    let deleteMedia = await mediaModel.findByIdAndDelete({ _id });
    if (!deleteMedia) {
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
        data: deleteMedia,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllMedia = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [{ text: { $regex: str, $options: "i" } }];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const bannerData = await mediaModel.aggregate([
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
          bannerData: [],
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

const getMediaById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    const mediaData = await mediaModel.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(_id) },
      },
      {
        $project: {
          __v: 0,
        },
      },
    ]);
    if (!mediaData) {
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
        data: mediaData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addMedia,
  updateMedia,
  deleteMedia,
  getAllMedia,
  getMediaById,
};
