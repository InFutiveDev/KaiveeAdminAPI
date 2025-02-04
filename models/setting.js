const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const settingSchema = new Schema(
  {
    contact_email: {
      type: String,
      default: null,
      trim: true,
    },
    contact_phone: {
      type: Number,
      default: null,
    },
    contact_address: {
      type: String,
      default: null,
      trim: true,
    },
    social_facebook: {
      type: String,
      default: null,
      trim: true,
    },
    social_twitter: {
      type: String,
      default: null,
      trim: true,
    },
    social_instagram: {
      type: String,
      default: null,
      trim: true,
    },
    social_google: {
      type: String,
      default: null,
      trim: true,
    },
    social_linkedin: {
      type: String,
      default: null,
      trim: true,
    },
    social_youtube: {
      type: String,
      default: null,
      trim: true,
    },
    whatsapp_api: {
      type: String,
      default: null,
      trim: true,
    },
    whatsapp_api_number: {
      type: String,
      default: null,
      trim: true,
    },
    live_chat: {
      type: String,
      default: null,
      trim: true,
    },
    ga_code: {
      type: String,
      default: null,
      trim: true,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("setting", settingSchema);
