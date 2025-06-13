const mongoose = require("mongoose");
const Notification = require("../../models/notifications");
const NotificationCategory = require("../../models/notificationCategory");
const User = require("../../models/user");
const { handleException } = require("../../helpers/exception");
const Response = require("../../helpers/response");
const Constant = require("../../helpers/constant");
const { ObjectId } = mongoose.Types;

// ✅ Create Notification
const createNotification = async (req, res) => {
  const { logger } = req;
  try {
    const { user, title, message, category, link, metadata } = req.body;

    const newNotification = await Notification.create({
      user: user ? ObjectId(user) : null,
      title,
      message,
      category: ObjectId(category),
      link,
      metadata,
    });

    return Response.success({
      res,
      msg: "Notification created successfully",
      status: 200,
      data: newNotification,
    });
  } catch (error) {
    return handleException(logger, res, error);
  }
};

// ✅ Bulk Notification to All Users
const sendBulkNotification = async (req, res) => {
  const { logger } = req;
  try {
    const { title, message, category, link, metadata } = req.body;

    const users = await User.find({}, "_id");

    const notifications = users.map(user => ({
      user: user._id,
      title,
      message,
      category: ObjectId(category),
      link,
      metadata,
    }));

    const created = await Notification.insertMany(notifications);

    return Response.success({
      res,
      msg: `${created.length} notifications sent successfully`,
      status: 200,
      data: created,
    });
  } catch (error) {
    return handleException(logger, res, error);
  }
};

// const BATCH_SIZE = 1000;

// const sendBulkNotification = async (req, res) => {
//   const { logger } = req;
//   try {
//     const { title, message, category, link, metadata } = req.body;

//     const users = await User.find({}, "_id").lean();

//     if (!users.length) {
//       return Response.error({
//         res,
//         msg: "No users found",
//         status: 404,
//       });
//     }

//     let totalSent = 0;

//     for (let i = 0; i < users.length; i += BATCH_SIZE) {
//       const userBatch = users.slice(i, i + BATCH_SIZE);

//       const notifications = userBatch.map(user => ({
//         user: user._id,
//         title,
//         message,
//         category: mongoose.Types.ObjectId(category),
//         link,
//         metadata,
//       }));

//       const result = await Notification.insertMany(notifications);
//       totalSent += result.length;
//     }

//     return Response.success({
//       res,
//       msg: `${totalSent} notifications sent in batches.`,
//       status: 200,
//     });
//   } catch (error) {
//     return handleException(logger, res, error);
//   }
// };


// ✅ Delete Notification
const deleteNotification = async (req, res) => {
  const { logger } = req;
  try {
    const { id } = req.params;

    const deleted = await Notification.findByIdAndDelete(id);
    if (!deleted) {
      return Response.error({ res, msg: "Notification not found", status: 404 });
    }

    return Response.success({
      res,
      msg: "Notification deleted",
      status: 200,
      data: deleted,
    });
  } catch (error) {
    return handleException(logger, res, error);
  }
};

// ✅ Get All Notifications (with optional filters)
const getAllNotifications = async (req, res) => {
  const { logger } = req;
  try {
    const { category, user, isRead, page = 1, limit = 10 } = req.query;

    const matchStage = {};

    if (isRead === "true" || isRead === "false") {
      matchStage.isRead = isRead === "true";
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const pipeline = [
      {
        $lookup: {
          from: "notificationcategories", // MongoDB collection name
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },

      {
        $lookup: {
          from: "users", // MongoDB collection name
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      { $match: matchStage },
    ];

    // Filter by category name (if provided)
    if (category) {
      pipeline.push({
        $match: {
          "category.name": { $regex: category, $options: "i" },
        },
      });
    }

    // Filter by user name (if provided)
    if (user) {
      pipeline.push({
        $match: {
          "user.name": { $regex: user, $options: "i" },
        },
      });
    }

    // Count total documents
    const countPipeline = [...pipeline, { $count: "total" }];
    const totalCountResult = await Notification.aggregate(countPipeline);
    const total = totalCountResult[0]?.total || 0;

    // Pagination + Projection
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 1,
          title: 1,
          message: 1,
          isRead: 1,
          createdAt: 1,
          category: {
            _id: "$category._id",
            name: "$category.name",
          },
          user: {
            _id: "$user._id",
            name: "$user.name",
          },
        },
      }
    );

    const notifications = await Notification.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      msg: "Fetched successfully",
      data: {
        notifications,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error in getAllNotifications:", error);
    logger?.error?.("Error in getAllNotifications:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
// ✅ CRUD for Category

// Create Category
const createCategory = async (req, res) => {
  try {
    const category = await NotificationCategory.create(req.body);
    return Response.success({ res, msg: "Category created", status: 200, data: category });
  } catch (error) {
    return handleException(req.logger, res, error);
  }
};

// Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await NotificationCategory.find().sort({ createdAt: -1 });
    return Response.success({ res, msg: "Categories fetched", status: 200, data: categories });
  } catch (error) {
    return handleException(req.logger, res, error);
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await NotificationCategory.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return Response.error({ res, msg: "Category not found", status: 404 });
    }
    return Response.success({ res, msg: "Category updated", status: 200, data: updated });
  } catch (error) {
    return handleException(req.logger, res, error);
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await NotificationCategory.findByIdAndDelete(id);
    if (!deleted) {
      return Response.error({ res, msg: "Category not found", status: 404 });
    }
    return Response.success({ res, msg: "Category deleted", status: 200, data: deleted });
  } catch (error) {
    return handleException(req.logger, res, error);
  }
};

module.exports = {
  createNotification,
  sendBulkNotification,
  deleteNotification,
  getAllNotifications,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
