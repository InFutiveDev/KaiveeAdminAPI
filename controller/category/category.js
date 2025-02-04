const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const categoryModel = require("../../models/category");
const mongoose = require("mongoose");
const _ = require("underscore");
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");

const addCategory = async (req, res) => {
  const { logger } = req;
  
  try {

    const images = {
      categoryImage: req.files.category_image ? req.files.category_image.filepath : null,
      homeImage: req.files.home_image ? req.files.home_image.filepath : null,
      mobile_banner: req.files.mobile_banner ? req.files.mobile_banner.filepath : null,
    };
    
    const imageUploadPromises = Object.entries(images).map(([imageKey, imagePath]) => {
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
    });
    
    const uploadedImagesData = await Promise.all(imageUploadPromises);
    
    const mediaLinkCategoryImage = uploadedImagesData[0] ? uploadedImagesData[0][0].metadata.mediaLink : null;
    const mediaLinkHomeImage = uploadedImagesData[1] ? uploadedImagesData[1][0].metadata.mediaLink : null;
    const mediaLinkmobile_banner = uploadedImagesData[2] ? uploadedImagesData[2][0].metadata.mediaLink : null;
    
    

    


    // const categoryImage = req.files.category_image.filepath;
    //   // firebase logic to upload the image
    //   let uploaded = bucket.upload(categoryImage, {
    //     public: true,
    //     destination: `images/${
    //       Math.random() * 10000 + req.files.category_image.originalFilename
    //     }`,
    //     // destination:image.filename,
    //     metadata: {
    //       firebaseStorageDownloadTokens: uuidv4(),
    //     },
    //   });
    //   let data = await uploaded;

    //   const mediaLink = data[0].metadata.mediaLink;

    // // Handle home image upload

    //  const homeImage = req.files.home_image.filepath;
    // //   // firebase logic to upload the image
    //   let uploadedhome = bucket.upload(homeImage, {
    //     public: true,
    //     destination: `images/${
    //       Math.random() * 10000 + req.files.home_image.originalFilename
    //     }`,
    //     // destination:image.filename,
    //     metadata: {
    //       firebaseStorageDownloadTokens: uuidv4(),
    //     },
    //   });
    //   let datahome = await uploadedhome;

    //  const mediaLinkhome = datahome[0].metadata.mediaLink;

    const existingCategoryUrl = await categoryModel.findOne({ category_url: req.data.category_url });

    if (existingCategoryUrl) {
      // Handle duplicate category URL
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.CREATE_ERR,
        data: 'Duplicate category URL: ' + req.data.category_url
      };
      return Response.error(obj);
    }
    
    

    const saveCategory = await categoryModel.create({
      category_name: req.data.category_name,
      parent_category_data:req.data.parent_category_data,
      perent_category_name: req.data.perent_category_name,
      category_menu_active: req.data.category_menu_active,
      category_url: req.data.category_url,
      category_image: mediaLinkCategoryImage,
      mobile_banner: mediaLinkmobile_banner,
      category_image_altTag: req.data.category_image_altTag,
      home_image:mediaLinkHomeImage,
      home_image_altTag:req.data.home_image_altTag,
      category_desc: req.data.category_desc,
      category_article: req.data.category_article,
      meta_title: req.data.meta_title,
      meta_desc: req.data.meta_desc,
      meta_keyword: req.data.meta_keyword,
      position: req.data.position,
    });
    
    
    if (!saveCategory) {
      const obj = {
        res,
        status: Constant.STATUS_CODE.BAD_REQUEST,
        msg: Constant.ERROR_MSGS.CREATE_ERR,
      };
      return Response.error(obj);
    }
     else {
      const obj = {
        res,
        msg: Constant.INFO_MSGS.CREATED_SUCCESSFULLY,
        status: Constant.STATUS_CODE.OK,
        data: saveCategory,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const updateCategory = async (req, res) => {
  const { logger } = req;
  try {
    let updateCategory ={};
    // let image
    const _id = req.params.id;
    
    if(typeof req.data.category_image === "string" || !req.files.category_image){
      
      // updateCategory = await categoryModel.findByIdAndUpdate(
      //   { _id },
      //   {
      //     category_name: req.data.category_name,
      //     perent_category_name: req.data.perent_category_name,
      //     category_menu_active: req.data.category_menu_active,
      //     category_url: req.data.category_url,
      //     category_image: req.data.category_image,
      //     home_image:req.data.home_image,
      //     category_desc: req.data.category_desc,
      //     category_article: req.data.category_article,
      //     meta_title: req.data.meta_title,
      //     meta_desc: req.data.meta_desc,
      //     meta_keyword: req.data.meta_keyword,
      //     position: req.data.position,
      //   },
      //   { new: true }
      // );
    }
    else{
     const categoryImage = req.files.category_image.filepath;
    // firebase logic to upload the image
    
      let uploaded = bucket.upload(categoryImage, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.category_image.originalFilename
        }`,
    // destination:image.filename,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });
      
      let data = await uploaded;

      const mediaLink = data[0].metadata.mediaLink;
      updateCategory.category_image = mediaLink
    }

    // Handle home image upload
    if(typeof req.data.home_image === "string" || !req.files.home_image){
    }
    else{  
     const homeImage = req.files.home_image.filepath;
    // firebase logic to upload the image
      let uploadedhome = bucket.upload(homeImage, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.home_image.originalFilename
        }`,
    // destination:image.filename,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });
      let datahome = await uploadedhome;

     const mediaLinkhome = datahome[0].metadata.mediaLink;
     updateCategory.home_image = mediaLinkhome;
    }
  
    // Handle banner mobile upload
    if(typeof req.data.mobile_banner === "string" || !req.files.mobile_banner){
    }
    else{  
     const mobileImage = req.files.mobile_banner.filepath;
    // firebase logic to upload the image
      let uploadedhome = bucket.upload(mobileImage, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.mobile_banner.originalFilename
        }`,
    // destination:image.filename,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });
      let datahome = await uploadedhome;

     const mediaLinkmobile = datahome[0].metadata.mediaLink;
     updateCategory.mobile_banner = mediaLinkmobile;
    }

       updateCategory = await categoryModel.findByIdAndUpdate(
        { _id },
        {
          ...updateCategory,
          category_name: req.data.category_name,
          parent_category_data:req.data.parent_category_data,
          perent_category_name:  req.data.perent_category_name ? (req.data.perent_category_name === "null" ? null : req.data.perent_category_name) : null,
          category_menu_active: req.data.category_menu_active,
          category_url: req.data.category_url,
          category_image_altTag:req.data.category_image_altTag,
          home_image_altTag:req.data.home_image_altTag,
          // category_image: mediaLink,
          // home_image:mediaLinkhome,
          category_desc: req.data.category_desc,
          category_article: req.data.category_article,
          meta_title: req.data.meta_title,
          meta_desc: req.data.meta_desc,
          meta_keyword: req.data.meta_keyword,
          position: req.data.position,
        },
        { new: true }
      );
     // }
    if (!updateCategory) {
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
        data: updateCategory,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const deleteCategory = async (req, res) => {
  const { logger } = req;

  try {
    const _id = req.params.id;
    let deleteCategory = await categoryModel.findByIdAndDelete({ _id });
    if (!deleteCategory) {
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
        data: deleteCategory,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

const getAllCategory = async (req, res) => {
  const { logger } = req;
  try {
    let { sortBy, str, page, limit } = req.query;

    let qry = {};
    if (str) {
      qry["$or"] = [
        { category_name: { $regex: str, $options: "i" } },
        { perent_category_name: { $regex: str, $options: "i" } },
      ];
    }
    offset = page || 1;
    limit = limit || 20;
    const skip = limit * (offset - 1);
    const categoryData = await categoryModel.aggregate([
      {
        $match: qry,
      },
      {
        $sort:{ updatedAt:-1 },
      },
      {
        $lookup: {
          from: "categories",
          localField: "perent_category_name",
          foreignField: "_id",
          as: "parentData",
        },
      },
      {
        $unwind: { path: "$parentData", preserveNullAndEmptyArrays: true },
      },
      {
        $project:{
              category_name:1,
              perent_category_name:"$parentData.category_name",
              parent_category_data:1,
              category_menu_active:1,
              category_url:1,
              category_image:1,
              category_image_altTag:1,
              home_image:1,
              home_image_altTag:1,
              category_desc:1,
              category_article:1,
              meta_title:1,
              meta_desc:1,
              meta_keyword:1,
              category_status:1,
              position:1,
 
        }
      },
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: parseInt(limit) }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (_.isEmpty(categoryData[0].paginatedResult)) {
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
        categoryData: categoryData[0].paginatedResult,
        pagination: {
          offset: parseInt(offset),
          limit: parseInt(limit),
          total: categoryData[0].totalCount[0].count,
        },
      },
    };
    return Response.success(obj);
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};


const getCategoryById = async (req, res) => {
  const { logger } = req;
  try {
    const _id = req.params.id;
     //const categoryData = await categoryModel.find({_id: mongoose.Types.ObjectId(_id)});
    const categoryData = await categoryModel.aggregate([
      {
        $match: { 
           _id: mongoose.Types.ObjectId(_id)
         // category_url : _id
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
           foreignField: "parent_category_data",
          as: "parentData",
        },
      },
      {
        $unwind: { path: "$parentData", preserveNullAndEmptyArrays: true },
      },
      {
      $project:{
          category_name:1,
          parent_category_data:"$parentData",
          perent_category_name:1,
          category_menu_active:1,
      category_url:1,
      category_image:1,
      mobile_banner:1,
      category_image_altTag:1,
      home_image:1,
      home_image_altTag:1,
      category_desc:1,
      category_article:1,
      meta_title:1,
      meta_desc: 1,
      meta_keyword: 1,
      position:1
      }
    }
    ]);
    if (!categoryData) {
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
        data: categoryData,
      };
      return Response.success(obj);
    }
  } catch (error) {
    console.log("error", error);
    return handleException(logger, res, error);
  }
};

module.exports = {
  addCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById
};
