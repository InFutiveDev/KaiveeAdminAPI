const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Types;

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: null,
      trim : true
    },
    type: {
      type: String,
      enum: ['user'],
      default: 'user',
    },
    email: {
      id: {
        type: String,
        lowercase: true,
      },
      mobile: {
        type: Number,
        default: null,
      },
      secondaryEmail: {
        type: String,
        lowercase: true,
        default: null,
      },
      password: {
        type: String,
        default: null,
      },
      registrationType: {
        type: String,
        enum: ['Google', 'Email'],
        default: 'Email',
      },
      verified: {
        type: Boolean,
        default: false,
      },
      token: {
        token: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    },
    forgotPassword: {
      token: {
        type: String,
        default: null,
      },
      expiryDate: {
        type: Date,
        default: Date.now(),
      },
      createdAt: {
        type: Date,
        default: null,
      },
    },
    profilePicture: {
      type: String,
      default: null,
    },
    jti: {
      // jwt token identifier
      ip: {
        type: String,
        default: null,
      },
      access: {
        type: String,
        default: null,
      },
      refresh: {
        type: String,
        default: null,
      },
    },
    gender:{
      type: String,
      default: null,
    },
    age:{
      type: Number,
      default: null,
    },
    status: {
      //block account by admin
      type: Boolean,
      default: true,
    },
    blocked: {
      // block user accounts on failed attempts
      status: { type: Boolean, default: false },
      expiry: { type: Date, default: null },
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('users', userSchema);
