const mongoose = require('mongoose');

const gradeReviewSchema = new mongoose.Schema({
  classCode: {
    type: String,
    required: true,
  },
  gradeCompositionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GradeComposition',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
  },
  expectationGrade: {
    type: Number,
    default: -1,
  },
  currentGrade: {
    type: Number,
  },
  explanation: {
    type: String,
  },
  comments: [
    {
      commenter: {
        type: mongoose.Schema.Types.String,
        ref: 'user',
      },
      comment: {
        type: String,
      },
    },
  ],
  finalDecision: {
    grade: {
      type: Number,
      default: 0,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
}, { timestamps: true });

module.exports = mongoose.model("gradeReview", gradeReviewSchema);
