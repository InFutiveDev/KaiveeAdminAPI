const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const landingPageModel = require("../../models/landingPage");
const testModel = require("../../models/test");
const mongoose = require("mongoose");
const _ = require("underscore");
const { bucket } = require("../../helpers/firebaseApp");
const { v4: uuidv4 } = require("uuid");
// const { addTest } = require("../test/test");
// const { ObjectId } = mongoose.Types;




const addLandingPage = async (req, res) => {
    const { logger } = req;
   

    try {
        
      const images = {
        landingpageImage: req.files.landingpageimage ? req.files.landingpageimage.filepath : null,
        contentImage: req.files.contentimage ? req.files.contentimage.filepath : null,
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
      
      const mediaLinklandingpageImage = uploadedImagesData[0] ? uploadedImagesData[0][0].metadata.mediaLink : null;
      const mediaLinkcontentImage = uploadedImagesData[1] ? uploadedImagesData[1][0].metadata.mediaLink : null;
      
      
      const savePage = await landingPageModel.create({
        name : req.data.name,
        landing_page_model : req.data.landing_page_model,
        title: req.data.title,
        leads_source:req.data.leads_source,
        mobile_landing:req.data.mobile_landing,
        bannerContant: req.data.bannerContant,
        landingPageArticle : req.data.landingPageArticle,
        testArticle : req.data.testArticle,
        metaTagTitle : req.data.metaTagTitle,
        metaTagDescription : req.data.metaTagDescription,
        metaTagKeywords : req.data.metaTagKeywords,
        phone: req.data.phone,
        url: req.data.url.replaceAll(" ","-"),
        landingpageimage : mediaLinklandingpageImage,
        contentimage:mediaLinkcontentImage,
        landingpageimage_altTag:req.data.landingpageimage_altTag,
        contentimage_altTag:req.data.contentimage_altTag,
        landingPageStatus: req.data.landingPageStatus,
        // addTest :req.data.addTest,
        testDescription:req.data.testDescription,
      });
      if (!savePage) {
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
          data: savePage,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  //get all

  const getAlllandingpage = async (req, res) => {
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
      const pageData = await landingPageModel.aggregate([
        {
          $match: qry,
        },
        {
          $sort: { createdAt: -1 },
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

  //getbyid

  const getLandingPageById = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;
      const landingData = await landingPageModel.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(_id)
          }
        }
        ,{
          $lookup: {
            from: 'tests',
            localField: 'addTest',
            foreignField: '_id',
            as: 'testInfo',
          }
        }
      ]);
      // console.log(landingData); 
      if (!landingData) {
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
          data: landingData,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  // delete

  const deletelandingPage = async (req, res) => {
    const { logger } = req;
  
    try {
      const _id = req.params.id;
      
      let deletelandingPage = await landingPageModel.findByIdAndDelete({ _id });
      if (!deletelandingPage) {
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
          data: deletelandingPage,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };


  //update

  const updatelandingpage = async (req, res) => {
    const { logger } = req;
    try {
      let updatelandingpage ={};
    // let image
    const _id = req.params.id;
    
    if(typeof req.data.landingpageimage === "string" || !req.files.landingpageimage){
      
      

    }
    else{
     const landingImage = req.files.landingpageimage.filepath;
    // firebase logic to upload the image
    
      let uploaded = bucket.upload(landingImage, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.landingpageimage.originalFilename
        }`,
    // destination:image.filename,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });
      
      let data = await uploaded;

      const mediaLink = data[0].metadata.mediaLink;
      updatelandingpage.landingpageimage = mediaLink
    }

    // Handle home image upload
    if(typeof req.data.contentimage === "string" || !req.files.contentimage){
    }
    else{  
     const homeImage = req.files.contentimage.filepath;
    // firebase logic to upload the image
      let uploadedhome = bucket.upload(homeImage, {
        public: true,
        destination: `images/${
          Math.random() * 10000 + req.files.contentimage.originalFilename
        }`,
    // destination:image.filename,
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      });
      let datahome = await uploadedhome;

     const mediaLinkhome = datahome[0].metadata.mediaLink;
     updatelandingpage.contentimage = mediaLinkhome;
    }

  
         updatelandingpage = await landingPageModel.findByIdAndUpdate(
          { _id },
          {
            ...updatelandingpage,
            name : req.data.name,
            landing_page_model: req.data.landing_page_model,
        title: req.data.title,
        leads_source:req.data.leads_source,
        mobile_landing:req.data.mobile_landing,
        bannerContant: req.data.bannerContant,
        landingPageArticle : req.data.landingPageArticle,
        testArticle : req.data.testArticle,
        metaTagTitle : req.data.metaTagTitle,
        landingpageimage_altTag:req.data.landingpageimage_altTag,
        contentimage_altTag:req.data.contentimage_altTag,
        metaTagDescription : req.data.metaTagDescription,
        metaTagKeywords : req.data.metaTagKeywords,
        phone: req.data.phone,
        url: req.data.url,
        landingPageStatus: req.data.landingPageStatus,
        addTest : req.data.addTest,
        testDescription:req.data.testDescription,
          },
          { new: true }
        );
      //}
      if (!updatelandingpage) {
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
          data: updatelandingpage,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };

  const updatetestlandingpage = async (req, res) => {
    const { logger } = req;
    try {
      const _id = req.params.id;

     
        const updatetestlandingpage = await landingPageModel.findByIdAndUpdate(
          { _id },
          req.body,
          {
            upsert:true
          },
          
        );
       
      
      if (!updatetestlandingpage) {
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
          data: updatetestlandingpage,
        };
        return Response.success(obj);
      }
    } catch (error) {
      console.log("error", error);
      return handleException(logger, res, error);
    }
  };
  
  module.exports = {
    addLandingPage,
    getAlllandingpage,
    getLandingPageById,
    deletelandingPage,
    updatelandingpage,
    updatetestlandingpage,
  };