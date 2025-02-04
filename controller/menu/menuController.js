const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const menuModel = require("../../models/menu");
const adminUserModel = require("../../models/admin");
const adminRoleModel = require("../../models/adminRole");
const { default: mongoose } = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;

const addMenu = async (req, res) => {
  const { logger } = req;
  try {
    const { MenuTitle, MenuPostion, MenuURL, MenuStatus } = req.body;

    const saveMenu = await menuModel.create({
      MenuTitle,
      MenuPostion,
      MenuURL,
      MenuStatus,
    });
    if (!saveMenu) {
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
        data: saveMenu,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

// const updateMenu = async (req, res) => {
//   const { logger } = req;
//   try {
//     const _id = req.params.id;
//     if (!_id) {
//       const obj = {
//         res,
//         status: Constant.STATUS_CODE.BAD_REQUEST,
//         msg: `_id ${Constant.INFO_MSGS.MSG_REQUIRED} in query params `,
//       };
//       return Response.error(obj);
//     }
//     const MenuStatus = req.body.MenuStatus;
//    
//     let updateData = await menuModel.findByIdAndUpdate({ _id }, req.body, {
//       new: true, 
//     }
//     );
//     if (!updateData ) {
//       const obj = {
//         res,
//         status: Constant.STATUS_CODE.BAD_REQUEST,
//         msg: Constant.ERROR_MSGS.DATA_NOT_FOUND,
//       };
//       return Response.error(obj);
//     } else {
//       const obj = {
//         res,
//         msg: Constant.INFO_MSGS.UPDATED_SUCCESSFULLY,
//         status: Constant.STATUS_CODE.OK,
//         data: updateData,
//         // data: "",
//       };
//       return Response.success(obj);
//     }
    
//   }
//   } catch (error) {
//     console.log("error", error);
//     return handleException(logger, res, error);
//   }
// };

const updateMenu = async (req, res) => {
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
    const MenuStatus = req.body.MenuStatus;
    if(MenuStatus === true){
    let updateData = await menuModel.findByIdAndUpdate({ _id }, req.body, {
      new: true, 
    }
    );
    if (!updateData ) {
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
    
  }else{
    res.status(406).send("not valid");
  }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const deleteMenu = async (req, res) => {
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
    let deleteData = await menuModel.findByIdAndDelete({ _id });
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

const getByUserIdMenu = async (req, res) => {
  const { logger } = req;
  try {
    const { userId } = req.decoded;
    let { sortBy, str, page, limit } = req.query;
    if (_.isUndefined(str)) str = "";
    if (sortBy === "recent") {
      sortBy = { createdAt: -1 };
    } else {
      sortBy = { createdAt: 1 };
    }

    const userData = await adminUserModel.findById({ _id:ObjectId(userId) });
    const adminRoleDetail = await adminRoleModel.findById({
      _id: userData.role,
    });
    // console.log("adminRoleDetail--->", adminRoleDetail);

    let qry = {};
    if (adminRoleDetail) {
      qry["$or"] = [{ _id: { $in: adminRoleDetail.RoleMenu } }];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const menuData = await menuModel.aggregate([
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
    if (_.isEmpty(menuData[0].paginatedResult)) {
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
        data: menuData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: menuData[0].totalCount[0].count,
        },
      },
    };

    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};


const getByIdMenu = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    const MenuStatus = req.params.MenuStatus;
   
    if (!_id) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: `_id ${Constant.INFO_MSGS.MSG_REQUIRED} in query params `,
      };
      return Response.error(obj);
    }
   
    
    let menuData = await menuModel.findById(_id);
    
     if (!menuData) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.INFO_MSGS.NO_DATA,
      };
      return Response.error(obj);
    }
   
     else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.SUCCESS,
        status: Constant.STATUS_CODE.OK,
        data: menuData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

// const getByIdMenu = async (req, res) => {
//   const { logger } = req;
//   try {
//     const _id = req.params.id;

//     if (!_id) {
//       const obj = {
//         res,
//         status: Constant.STATUS_CODE.BAD_REQUEST,
//         msg: `_id ${Constant.INFO_MSGS.MSG_REQUIRED} in query params `,
//       };
//       return Response.error(obj);
//     }

//     const MenuStatus = req.query.MenuStatus;

//     if (MenuStatus === "true") {
//       const menuData = await menuModel.findById(_id);
//       if (!menuData) {
//         const obj = {
//           res,
//           status: Constant.STATUS_CODE.BAD_REQUEST,
//           msg: Constant.INFO_MSGS.NO_DATA,
//         };
//         return Response.error(obj);
//       } else {
//         const obj = {
//           res,
//           msg: Constant.INFO_MSGS.SUCCESS,
//           status: Constant.STATUS_CODE.OK,
//           data: menuData,
//         };
//         return Response.success(obj);
//       }
//     } else {
//       const obj = {
//         res,
//         status: Constant.STATUS_CODE.BAD_REQUEST,
//         msg: Constant.INFO_MSGS.NO_DATA,
//       };
//       return Response.error(obj);
//     }
//   } catch (error) {
//     console.log("error", error);
//     return handleException(logger, res, error);
//   }
// };

const getAllMenu = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;
    if (_.isUndefined(str)) str = "";
    if (sortBy === "recent") {
      sortBy = { createdAt: -1 };
    } else {
      sortBy = { createdAt: 1 };
    }
    let qry = {};
    if (str) {
      qry["$or"] = [{ MenuTitle: { $regex: str, $options: "i" } }];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const menuData = await menuModel.aggregate([
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
    if (_.isEmpty(menuData[0].paginatedResult)) {
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
        data: menuData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: menuData[0].totalCount[0].count,
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
  addMenu,
  updateMenu,
  deleteMenu,
  getByUserIdMenu,
  getByIdMenu,
  getAllMenu,
};
