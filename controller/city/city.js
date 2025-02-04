const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const cityModel = require("../../models/city");

// const addCity = async(req,res)=>{
//     const{logger} = req;
//     try{
//         const{
//             city_name,
//             picode,
//             state_name,
//         } = req.body;
//         const savecity = await cityModel.create({
//             city_name,
//             picode,
//             state_name,
//         });
//         if (!savecity) {
//             const obj = {
//               res,
//               status: Constant.STATUS_CODE.BAD_REQUEST,
//               msg: Constant.ERROR_MSGS.CREATE_ERR,
//             };
//             return Response.error(obj);
//           } else {
//             const obj = {
//               res,
//               msg: Constant.INFO_MSGS.CREATED_SUCCESSFULLY,
//               status: Constant.STATUS_CODE.OK,
//               data: savecity,
//             };
//             return Response.success(obj);
//           }
//         } catch (error) {
//           console.log("error", error);
//           return handleException(logger, res, error);
//         }
// };

const deleteCity = async(req,res)=>{
    const { logger } = req;

  try {
    const _id = req.params.id;
    let deletecity = await cityModel.findByIdAndDelete({ _id });
    if (!deletecity) {
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
        data: deletecity,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getcityById = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      const cityData = await cityModel.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(_id) },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ]);
      if (cityData) {
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
          data: cityData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const getAllcity = async (req, res) => {
    const { logger } = req;
    try {
      let { sortBy, str, page, limit } = req.query;
  
      let qry = {};
      if (str) {
        qry["$or"] = [
          { name: { $regex: str, $options: "i" } }
        ];
      }
      offset = page || 1;
      limit = limit || 20;
      const skip = limit * (offset - 1);
      const cityData = await cityModel.aggregate([
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
      if (_.isEmpty(pageData[0].paginatedResult)) {
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
          pageData: pageData[0].paginatedResult,
          pagination: {
            offset: parseInt(offset),
            limit: parseInt(limit),
            total: pageData[0].totalCount[0].count,
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
    // addCity,
    deleteCity,
    getcityById,
    getAllcity,

};