const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notification_category: {
      type: String,
      default: null,
    },
    notification_status: {
      type: Boolean,
      default: false,
    },
    notification_description: {
      type: String,
      default: null,
    },
    notification_news: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
