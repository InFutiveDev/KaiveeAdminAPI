const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const notificationModel = require("../../models/notifications");
const adminUserModel = require("../../models/admin");
const adminRoleModel = require("../../models/adminRole");
const { default: mongoose } = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;

const addNotification = async (req, res) => {
  const { logger } = req;
  try {
    const { notification_category, notification_status, notification_description,  notification_news } = req.body;
    

    const saveNotification = await notificationModel.create({
        // userId: req.decoded.userId,
        notification_category,
        notification_status,
        notification_description,
        notification_news,
    });
    if (!saveNotification) {
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
        data: saveNotification,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};



const updateNotification = async (req, res) => {
    const { logger } = req;
  
    try {
      const _id = req.params.id;
  
      if (!_id) {
        return Response.error({
          res,
          status: Constant.STATUS_CODE.BAD_REQUEST,
          msg: `_id ${Constant.INFO_MSGS.MSG_REQUIRED} in query params `,
        });
      }
  
      const updateData = await notificationModel.findByIdAndUpdate(
        _id,
        req.body,
        { new: true } // <- moved correctly here
      );
  
      if (!updateData) {
        return Response.error({
          res,
          status: Constant.STATUS_CODE.BAD_REQUEST,
          msg: Constant.ERROR_MSGS.DATA_NOT_FOUND,
        });
      }
  
      return Response.success({
        res,
        msg: Constant.INFO_MSGS.UPDATED_SUCCESSFULLY,
        status: Constant.STATUS_CODE.OK,
        data: updateData,
      });
  
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };
  

const deleteNotification = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    if (!_id) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: `_id ${Constant.INFO_MSGS.MSG_REQUIRED} in query params `,
      };
      return Response.error(obj);
    }
    let deleteData = await notificationModel.findByIdAndDelete({ _id });
    if (!deleteData) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.DATA_NOT_FOUND,
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.DELETED_SUCCESSFULLY,
        status: Constant.STATUS_CODE.OK,
        data: deleteData,
        // data: "",
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getEnabledNotifications = async (req, res) => {
    const { logger } = req;
  
    try {
      const { category, status } = req.query;
  
      const query = {};
  
      // Handle multiple categories
      if (category) {
        const categories = category.split(',').map(c => c.trim());
        query.notification_category = { $in: categories };
      }
  
      // Handle status (true/false)
      if (status === "true" || status === "false") {
        query.notification_status = status === "true";
      }
  
      const notifications = await notificationModel
        .find(query)
        .sort({ createdAt: -1 });
  
      return Response.success({
        res,
        msg: Constant.INFO_MSGS.SUCCESS,
        status: Constant.STATUS_CODE.OK,
        data: notifications,
      });
    } catch (error) {
      console.log("Error fetching notifications:", error);
      return handleException(logger, res, error);
    }
  };
  



module.exports = {
    addNotification,
    updateNotification,
    deleteNotification,
    getEnabledNotifications
    };
