const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const adminRoleSchema = new Schema(
  {
    RoleTitle: {
      type: String,
      default: null,
    },
    RoleMenu: [
      {
        type: ObjectId,
        ref: "adminRoles",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("adminRole", adminRoleSchema);
