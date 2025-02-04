const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const userModel = require("../../models/user");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;

const getAllUser = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { name: { $regex: str, $options: "i" } },
        { userName: { $regex: str, $options: "i" } },
      ];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const userData = await userModel.aggregate([
      {
        $match: qry,
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          paginatedResult: [
            { $skip: skip },
            { $limit: parseInt(limit) },
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
                company: 1,
                type: 1,
                mobile: "$email.mobile",
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(userData[0].paginatedResult)) {
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
        userData: userData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: userData[0].totalCount[0].count,
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
  getAllUser,
};
