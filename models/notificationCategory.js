const { Timestamp } = require('firebase-admin/firestore');
const mongoose = require('mongoose');
const { times } = require('underscore');

const NotificationCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  
},
{
    timestamps:true,
});

module.exports = mongoose.model('NotificationCategory', NotificationCategorySchema);