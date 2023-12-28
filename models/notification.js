const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Reference to either Teacher or System
  },
  receiverIds: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user' 
  }],
  classCode: {
    type: mongoose.Schema.Types.String,
    required: true,
    ref: 'class'
  },
  type: {
    type: String,
    required: true,
    enum: ['grade_composition_finalized', 'grade_review_reply', 'mark_review_decision', 'grade_review_request']
  },
  message: String,
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model("notification", notificationSchema);
