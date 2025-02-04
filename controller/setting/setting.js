const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const settingModel = require("../../models/setting");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;

const addSetting = async (req, res) => {
  const { logger } = req;

  try {
    const settingData = req.body;
    const saveSetting = await settingModel.create(settingData);
    if (!saveSetting) {
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
        data: saveSetting,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const updateSetting = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    let updateSetting = await settingModel.findByIdAndUpdate(
      { _id },
      req.body,
      {
        new: true,
      }
    );
    if (!updateSetting) {
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
        data: updateSetting,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllSetting = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    let settingData = await settingModel.find();
    if (!settingData) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.INFO_MSGS.NO_DATA,
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.SUCCESS,
        status: Constant.STATUS_CODE.OK,
        data: settingData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addSetting,
  updateSetting,
  getAllSetting,
};
