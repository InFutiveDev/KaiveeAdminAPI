const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const testModel = require("../../models/test");
const habitModel = require("../../models/hebit");
const healthRiskModel = require("../../models/healthRisk");
const mongoose = require("mongoose");
const _ = require("underscore");
const { ObjectId } = mongoose.Types;
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");
const { async } = require("crypto-random-string");

const addTest = async (req, res) => {
  const { logger } = req;

  // console.log(req);
  try {
    //  updateCategory.home_image = mediaLinkhome;

    //  const homeImage = req.files.package_image.filepath;
    // // firebase logic to upload the image
    //   let uploadedhome = bucket.upload(homeImage, {
    //     public: true,
    //     destination: `images/${
    //       Math.random() * 10000 + req.files.package_image.originalFilename
    //     }`,
    // // destination:image.filename,
    //     metadata: {
    //       firebaseStorageDownloadTokens: uuidv4(),
    //     },
    //   });
    //   let datahome = await uploadedhome;

    //  const mediaLink =req.files ? datahome[0].metadata.mediaLink : null;
    const images = {
      packageImage: req.files.package_image
        ? req.files.package_image.filepath
        : null,
    };

    const imageUploadPromises = Object.entries(images).map(
      ([imageKey, imagePath]) => {
        if (imagePath) {
          const imageUploadPromise = bucket.upload(imagePath, {
            public: true,
            destination: `images/${Math.random() * 10000 + imagePath}`,
            metadata: {
              firebaseStorageDownloadTokens: uuidv4(),
            },
          });

          return imageUploadPromise;
        } else {
          return Promise.resolve(null);
        }
      }
    );

    const uploadedImagesData = await Promise.all(imageUploadPromises);

    const mediaLinkPackageImage = uploadedImagesData[0]
      ? uploadedImagesData[0][0].metadata.mediaLink
      : null;

    const existingTestUrl = await testModel.findOne({
      test_url: req.data.test_url,
    });

    if (existingTestUrl) {
      // Handle duplicate category URL
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.CREATE_ERR,
        data: "Duplicate test url: " + req.data.test_url,
      };
      return Response.error(obj);
    }
    const existingTestname = await testModel.findOne({
      test_name: req.data.test_name,
    });

    if (existingTestname) {
      // Handle duplicate category URL
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.CREATE_ERR,
        data: "Duplicate test name: " + req.data.test_name,
      };
      return Response.error(obj);
    }

    //multiple habit
    const habitIds = req.data.by_habits
      ? req.data.by_habits.split(",").map((id) => id.trim())
      : [];

    // Fetch the habit documents from the database based on the ObjectIds
    const habits = await habitModel.find({ _id: { $in: habitIds } });

    //multiple healthRisk
    const healthRiskIds = req.data.by_healthRisk
      ? req.data.by_healthRisk.split(",").map((id) => id.trim())
      : [];

    // Fetch the habit documents from the database based on the ObjectIds
    const healthRisks = await healthRiskModel.find({
      _id: { $in: healthRiskIds },
    });

    //const testData = req.body;
    const saveTest = await testModel.create({
      package_type: req.data.package_type,
      package_image: mediaLinkPackageImage,
      package_image_altTag: req.data.package_image_altTag,
      specialityName: req.data.specialityName,
      cat_id: req.data.cat_id,
      code: req.data.code,
      test_name: req.data.test_name,
      test_pre_test_info: req.data.test_pre_test_info,
      report: req.data.report,
      test_url: req.data.test_url,
      mrp: req.data.mrp,
      offer_price: req.data.offer_price,
      no_of_parameters: req.data.no_of_parameters,
      test_components: req.data.test_components,
      meta_title: req.data.meta_title,
      meta_desc: req.data.meta_desc,
      meta_keyword: req.data.meta_keyword,
      search_tag: req.data.search_tag,
      also_known_as: req.data.also_known_as,
      test_type: req.data.test_type,
      department: req.data.department,
      preparation: req.data.preparation,
      reporting: req.data.reporting,
      test_price_info: req.data.test_price_info,
      related_tests: req.data.related_tests,
      by_habits: habits.map((habit) => ({
        _id: habit._id,
        hebitName: habit.hebitName, // Adjust as per your habitModel schema
      })),
      by_healthRisk: healthRisks.map((risk) => ({
        _id: risk._id,
        healthRiskTitle: risk.healthRiskTitle, // Adjust as per your healthRiskModel schema
      })),
      test_status: req.data.test_status,
      position: req.data.position,
      collection_type: req.data.collection_type,
      number_of_star: req.data.number_of_star,
      number_of_review: req.data.number_of_review,
    });

    if (!saveTest) {
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
        data: saveTest,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const updateTest = async (req, res) => {
  const { logger } = req;
  try {
    let updateFields = {};
    const _id = req.params.id;
    const previousImage = updateFields.package_image;

    if (!req.files.package_image) {
      updateFields.package_image = previousImage;
    } else {
      const image = req.files.package_image.filepath;
      let uploaded = bucket.upload(image, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.package_image.originalFilename
        }`,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });
      let data = await uploaded;
      const mediaLink = data[0].metadata.mediaLink;
      updateFields.package_image = mediaLink;
    }

    const existingTest = await testModel.findById(_id);
    // Only update by_habits and by_healthRisk if they are provided
    // Update by_habits if provided
    if (req.data.by_habits !== undefined) {
      if (req.data.by_habits.trim() === "" || req.data.by_habits === null) {
        updateFields.by_habits = []; // Set to empty array if null or empty string
      } else {
        const habitIds = req.data.by_habits.split(",").map((id) => id.trim());
        const habits = await habitModel.find({ _id: { $in: habitIds } });
        updateFields.by_habits = habits.map((habit) => ({
          _id: habit._id,
          hebitName: habit.hebitName, // Adjust according to your habitModel schema
        }));
      }
    } else {
      updateFields.by_habits =
        existingTest && existingTest.by_habits ? existingTest.by_habits : [];
    }

    // Update by_healthRisk if provided
    if (req.data.by_healthRisk !== undefined) {
      if (
        req.data.by_healthRisk.trim() === "" ||
        req.data.by_healthRisk === null
      ) {
        updateFields.by_healthRisk = []; // Set to empty array if null or empty string
      } else {
        const healthRiskIds = req.data.by_healthRisk
          .split(",")
          .map((id) => id.trim());
        const healthRisks = await healthRiskModel.find({
          _id: { $in: healthRiskIds },
        });
        updateFields.by_healthRisk = healthRisks.map((risk) => ({
          _id: risk._id,
          healthRiskTitle: risk.healthRiskTitle, // Adjust according to your healthRiskModel schema
        }));
      }
    } else {
      updateFields.by_healthRisk =
        existingTest && existingTest.by_healthRisk
          ? existingTest.by_healthRisk
          : [];
    }

    const updatedTest = await testModel.findByIdAndUpdate(
      { _id },
      {
        $set: {
          ...updateFields,
          package_type: req.data.package_type,
          package_image_altTag: req.data.package_image_altTag,
          specialityName: req.data.specialityName,
          cat_id: req.data.cat_id
            ? req.data.cat_id === "null"
              ? null
              : req.data.cat_id
            : null,
          code: req.data.code,
          test_name: req.data.test_name,
          test_pre_test_info:
            req.data.test_pre_test_info === undefined
              ? " "
              : req.data.test_pre_test_info,
          report: req.data.report,
          test_url: req.data.test_url,
          mrp: req.data.mrp,
          offer_price: req.data.offer_price,
          no_of_parameters: req.data.no_of_parameters,
          test_components:
            req.data.test_components === undefined
              ? " "
              : req.data.test_components,
          meta_title: req.data.meta_title,
          meta_desc: req.data.meta_desc,
          meta_keyword: req.data.meta_keyword,
          search_tag: req.data.search_tag,
          also_known_as: req.data.also_known_as,
          test_type: req.data.test_type,
          department: req.data.department,
          preparation:
            req.data.preparation === undefined ? " " : req.data.preparation,
          reporting:
            req.data.reporting === undefined ? " " : req.data.reporting,
          test_price_info:
            req.data.test_price_info === undefined
              ? " "
              : req.data.test_price_info,
          related_tests:
            req.data.related_tests === undefined ? " " : req.data.related_tests,
          test_status: req.data.test_status,
          position: req.data.position === undefined ? " " : req.data.position,
          collection_type: req.data.collection_type,
          number_of_star:
            req.data.number_of_star === " " ? " " : req.data.number_of_star,
          number_of_review:
            req.data.number_of_review === " " ? " " : req.data.number_of_review,
        },
      },
      { new: true }
    );
    // }

    if (!updatedTest) {
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
        data: updatedTest,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

// const updateTest = async (req, res) => {
//   const { logger } = req;
//   try {
//     const _id = (req.params.id);

//     let updateTest = await testModel.findByIdAndUpdate({ _id },req.body,{
//       new: true,
//     });
//     if (!updateTest) {
//       const obj = {
//         res,
//         status: Constant.STATUS_CODE.BAD_REQUEST,
//         msg: Constant.INFO_MSGS.NO_DATA,
//       };
//       return Response.error(obj);
//     } else {
//       const obj = {
//         res,
//         msg: Constant.INFO_MSGS.UPDATED_SUCCESSFULLY,
//         status: Constant.STATUS_CODE.OK,
//         data: updateTest,
//       };
//       return Response.success(obj);
//     }
//   } catch (error) {
//     console.log("error", error);
//     return handleException(logger, res, error);
//   }
// };

const deleteTest = async (req, res) => {
  const { logger } = req;

  try {
    const _id = req.params.id;
    let deleteTest = await testModel.findByIdAndDelete({ _id });
    if (!deleteTest) {
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
        data: deleteTest,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllTest = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { package_type: { $regex: str, $options: "i" } },
        { specialityName: { $regex: str, $options: "i" } },
        { test_name: { $regex: str, $options: "i" } },
        { search_tag: { $regex: str, $options: "i" } },
        { also_known_as: { $regex: str, $options: "i" } },
      ];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const testData = await testModel.aggregate([
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
    if (_.isEmpty(testData[0].paginatedResult)) {
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
        testData: testData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: testData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getTestById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
    const testData = await testModel.find({
      _id: mongoose.Types.ObjectId(_id),
    });
    //  const testData = await testModel.aggregate([
    //   {
    //     $match: {
    //       _id: mongoose.Types.ObjectId(_id)

    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "tests",
    //       localField: "test_name",
    //        foreignField: "_id",
    //       as: "test",
    //     },
    //   },
    //   {
    //     $unwind: { path: "$test", preserveNullAndEmptyArrays: true },
    //   },
    //   {
    //   $project:{
    //     __v:0
    //   }
    // }
    // ]);
    if (!testData) {
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
        data: testData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

// try {
//   const excelData = req.body;
//   const now = new Date();
//   const fiveMinutesAgo = new Date(now.getTime() - 300000);
//  // console.log(fiveMinutesAgo)
//   const saveExcel = await testModel.insertMany(excelData);

//   const addTestExcel = async (req, res) => {
//   const { logger } = req;
//   try {

//     const test_url = req.params.test_url;

//     let updateTestexcel = await testModel.findByIdAndUpdate({test_url},req.body,{
//       new: true,
//     });

//       if (!updateTestexcel) {
//         const obj = {
//           res,
//           status: Constant.STATUS_CODE.BAD_REQUEST,
//           msg: Constant.ERROR_MSGS.CREATE_ERR,
//         };
//         return Response.error(obj);
//       } else {
//         const obj = {
//           res,
//           msg: Constant.INFO_MSGS.CREATED_SUCCESSFULLY,
//           status: Constant.STATUS_CODE.OK,
//           data: updateTestexcel,
//         };
//         return Response.success(obj);
//       }

//   } catch (error) {
//     console.log("error", error);
//     return handleException(logger, res, error);
//   }
// };

const getAllconvertcatId = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { package_type: { $regex: str, $options: "i" } },
        { specialityName: { $regex: str, $options: "i" } },
        { test_name: { $regex: str, $options: "i" } },
      ];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const testData = await testModel.find();
    for (const catID of testData) {
      await testModel.updateOne(
        {
          _id: catID._id,
        },
        {
          $set: {
            cat_id: new ObjectId(catID.cat_id),
          },
        }
      );
    }
    const obj = {
      res,
      msg: Constant.INFO_MSGS.SUCCESS,
      status: Constant.STATUS_CODE.OK,
      data: testData,
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const testByfeaturedCategory = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;

    let updatetest = await testModel.findByIdAndUpdate({ _id }, req.body, {
      new: true,
    });
    if (updatetest.featured_test === false) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.UPDATED_SUCCESSFULLY + " not featured test",
        data: updatetest,
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.UPDATED_SUCCESSFULLY + " featured test",
        status: Constant.STATUS_CODE.OK,
        data: updatetest,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};
const geturl = async (req, res) => {
  const { logger } = req;
  try {
    // const testData = await testModel.find();

    // for(const testurl of testData){
    //   await testModel.updateOne({

    //     _id: testurl._id,
    //       $set: {
    //         test_url: "",
    //       }
    //     });

    //  }

    // update many

    const testData = await testModel.updateMany(
      { collection_type: { $exists: false } },
      { $set: { collection_type: "centre-visit" } }
    );
    if (!testData) {
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
        data: testData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};
const updatetestByStatus = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;

    let updatetest = await testModel.findByIdAndUpdate({ _id }, req.body, {
      new: true,
    });
    if (updatetest.test_status === false) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.OK,
        msg: Constant.INFO_MSGS.SUCCESS + " test not avilable",
      };
      return Response.error(obj);
    } else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.SUCCESS + " test avialble",
        status: Constant.STATUS_CODE.OK,
        data: updatetest,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addTest,
  updateTest,
  deleteTest,
  getAllTest,
  getTestById,
  getAllconvertcatId,
  // addTestExcel,
  testByfeaturedCategory,
  geturl,
  updatetestByStatus,
};
