const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    fullName: {
      type: String,
    },
    studentId: {
      type: String,
      required: true
    },
    email: {
      type: String
    }
  },
  classCode: {
    type: String,
    required: true,
  },
  grades: [
    {
      gradeCompositionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GradeComposition',
        required: true,
      },
      grade: {
        type: Number,
        required: true,
        default: 0
      },
    },
  ]
});

module.exports = mongoose.model("grade", gradeSchema);

