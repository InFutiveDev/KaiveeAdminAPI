const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const adminRoleModel = require("../../models/adminRole");
const { default: mongoose } = require("mongoose");
const _ = require("underscore");

const addAdminRole = async (req, res) => {
  const { logger } = req;
  try {
    const { RoleTitle, RoleMenu } = req.body;

    const existRole = await adminRoleModel.find({RoleTitle})
    console.log("existRole-->",existRole)
    if(!_.isEmpty(existRole)){
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.ROLE_EXISTS,
    };
    return Response.error(obj);
    }

    const saveAdminRole = await adminRoleModel.create({
      RoleTitle,
      RoleMenu,
    });
    if (!saveAdminRole) {
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
        data: saveAdminRole,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const updateAdminRole = async (req, res) => {
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
    let updateData = await adminRoleModel.findByIdAndUpdate({ _id }, req.body, {
      new: true,
    });
    if (!updateData) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.DATA_NOT_FOUND,
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.UPDATED_SUCCESSFULLY,
        status: Constant.STATUS_CODE.OK,
        data: updateData,
        // data: "",
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const deleteAdminRole = async (req, res) => {
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
    let deleteData = await adminRoleModel.findByIdAndDelete({ _id });
    if (!deleteData) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.USER_NOT_FOUND,
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

const getByIdAdminRole = async (req, res) => {
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
    let AdminRoleData = await adminRoleModel.findById(_id);
    console.log("AdminRoleData",AdminRoleData)
    if (!AdminRoleData) {
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
        data: AdminRoleData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllAdminRole = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit, state, city } = req.query;
    if (_.isUndefined(str)) str = "";
    if (sortBy === "recent") {
      sortBy = { createdAt: -1 };
    } else {
      sortBy = { createdAt: 1 };
    }

    let qry = {};
    if (str) {
      qry["$or"] = [{ RoleTitle: { $regex: str, $options: "i" } }];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const AdminRoleData = await adminRoleModel.aggregate([
      {
        $match: qry,
      },
      { $sort: sortBy },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(AdminRoleData[0].paginatedResult)) {
      obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.ITEMS_NOT_AVAILABLE,
        data: {
          data: [],
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
        data: AdminRoleData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: AdminRoleData[0].totalCount[0].count,
        },
      },
    };

    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addAdminRole,
  updateAdminRole,
  deleteAdminRole,
  getByIdAdminRole,
  getAllAdminRole,
};
