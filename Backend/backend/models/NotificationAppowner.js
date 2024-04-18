const mongoose = require('mongoose');
const appOwnerNotificationSchema = new mongoose.Schema({
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    type: {
      type: String,
      enum: ['application', 'response'],
      required: true,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    image:{
      type: String,
      required:false
    }
  }, {
    timestamps: true,
  });
  const AppOwnerNotification = mongoose.model('AppOwnerNotification', appOwnerNotificationSchema);
  module.exports =AppOwnerNotification;