const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const adminModel = require("../../models/admin");
const { default: mongoose } = require("mongoose");
const _ = require("underscore");
const bcrypt = require("bcrypt");
const randomString = require("crypto-random-string");
const SignupValidation = require("../../helpers/joi-validation");
const jwt = require("jsonwebtoken");
const { ObjectId } = mongoose.Types;

const addAdmin = async (req, res) => {
  const { logger } = req;
  try {
    const { name, email, password, role, secondaryEmail } = req.body;

    const { error } = SignupValidation.registerWithEmailAndPassword({
      name,
      email,
      password,
    });
    if (error) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: error.details[0].message,
      };
      return Response.error(obj);
    }

    const userInfo = await adminModel.findOne({ "email.id": email });
    if (userInfo) {
      const resp = {
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.ACCOUNT_EXISTS,
      };
      throw resp;
    }

    // Encrypt password By Bcrypt
    const passwordHash = bcrypt.hashSync(password, 10);
    // const passwordHash = passwordHash;

    // Email Token Verification
    const token = randomString({
      length: 15,
      type: "url-safe",
    });

    // Create User Document in Mongodb
    const { _id } = await adminModel.create({
      name,
      role,
      email: {
        id: email,
        verified: true,
        registrationType: "Email",
        password: passwordHash,
        token: {
          token,
          createdAt: Date.now(),
        },
        secondaryEmail,
      },
    });
    // Send Response To Client
    const obj = {
      res,
      status: Constant.STATUS_CODE.CREATED,
      msg: Constant.INFO_MSGS.CREATED_SUCCESSFULLY,
      data: {
        _id,
        name,
        email,

        // token,
        // passwordHash
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error--->", error);
    return handleException(logger, res, error);
  }
};

const updateAdmin = async (req, res) => {
  const { logger } = req;
  try {
    var passwordHash;
    var updateData;

    const _id = req.params.id;
    if (!_id) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: `_id ${Constant.INFO_MSGS.MSG_REQUIRED} in query params `,
      };
      return Response.error(obj);
    }
    const { name, email, password, role, secondaryEmail } = req.body;

    const pwRegExp = /^\$2[ayb]\$.{56}$/;
    const pwVerify = pwRegExp.test(password);

    if (pwVerify == true) {
      updateData = await adminModel.findByIdAndUpdate(
        { _id },
        {
          name,
          role,
          "email.password": password,
          "email.secondaryEmail": secondaryEmail,
        },
        {
          new: true,
        }
      );
    } else {
      const { error } = SignupValidation.registerWithEmailAndPassword({
        name,
        email,
        password,
      });
      if (error) {
        const obj = {
          res,
          status: Constant.STATUS_CODE.BAD_REQUEST,
          msg: error.details[0].message,
        };
        return Response.error(obj);
      }
      // Encrypt password By Bcrypt
      passwordHash = bcrypt.hashSync(password, 10);

      // const token = randomString({
      //   length: 15,
      //   type: "url-safe",
      // });

      updateData = await adminModel.findByIdAndUpdate(
        { _id },
        {
          name,
          role,
          "email.password": passwordHash,
          "email.secondaryEmail": secondaryEmail,
        },
        {
          new: true,
        }
      );
    }
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
        // data: updateData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const deleteAdmin = async (req, res) => {
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
    let deleteData = await adminModel.findByIdAndDelete({ _id });
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
        // data: deleteData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getByIdAdmin = async (req, res) => {
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
      let qry = {};
      qry["$or"] = [{ _id: ObjectId(_id) }];
      const adminUserData = await adminModel.aggregate([
        {
          $match: qry,
        },
        {
          $lookup: {
            from: "adminroles",
            localField: "role",
            foreignField: "_id",
            as: "roleData",
          },
        },
        {
          $unwind: { path: "$roleData", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            _id: 1,
            userId: "$_id",
            name: 1,
            userName: {
              $ifNull: ["$userName", null],
            },
            emailId: "$email.id",
            password: "$email.password",
            profilePicture: 1,
            secondaryEmailId: "$email.secondaryEmail",
            isPrivate: 1,
            registrationType: "$email.registrationType",
            // walletAmount: 1,
            company: 1,
            role: "$roleData",
            type: 1,
            mobile: "$email.mobile",
            city: 1,
            state: 1,
          },
        },
      ]);
      if (!adminUserData) {
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
          data: adminUserData,
        };
        return Response.success(obj);
      }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllAdmin = async (req, res) => {
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
      qry["$or"] = [
        { name: { $regex: str, $options: "i" } },
        {' email.id': { $regex: str, $options: "i" } },
      ];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const adminUserData = await adminModel.aggregate([
      {
        $match: qry,
      },
      { $sort: sortBy },
      {
        $lookup: {
          from: "adminroles",
          localField: "role",
          foreignField: "_id",
          as: "roleData",
        },
      },
      {
        $unwind: { path: "$roleData", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          _id: 1,
          userId: "$_id",
          name: 1,
          userName: {
            $ifNull: ["$userName", null],
          },
          emailId: "$email.id",
          profilePicture: 1,
          secondaryEmailId: "$email.secondaryEmail",
          isPrivate: 1,
          registrationType: "$email.registrationType",
          // walletAmount: 1,
          company: 1,
          role: "$roleData",
          type: 1,
          mobile: "$email.mobile",
          city: 1,
          state: 1,
        },
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(adminUserData[0].paginatedResult)) {
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
        data: adminUserData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: adminUserData[0].totalCount[0].count,
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
  addAdmin,
  updateAdmin,
  deleteAdmin,
  getByIdAdmin,
  getAllAdmin,
};
