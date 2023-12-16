const mongoose = require('mongoose');

const gradeCompositionSchema = new mongoose.Schema({
  id: {
    type: String
  },
  name: {
    type: String,
    required: true,
  },
  gradeScale: {
    type: Number,
    required: true,
  },
  position: {
    type: Number,
    required: true,
  },
  finalized: {
    type: Boolean,
    default: false,
  },
});

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  teachers: [
    {
      id: String,
      name: String
    }
  ],
  classOwner: {
    id: String,
    name: String,
  },
  students: [
    {
      type: String,
    }
  ],
  classCode: {
    type: String,
    required: true,
    unique: true,
  },
  invitationCode: {
    type: String,
    unique: true,
  },
  section: {
    type: String,
  },
  subject: {
    type: String,
  },
  room: {
    type: String,
  },
  gradeCompositions: {
    type: [gradeCompositionSchema],
    default: [
      {
        name: 'Exam',
        gradeScale: '100',
        position: 1,
      },
    ],
  },
});

const GradeComposition = mongoose.model('gradeComposition', gradeCompositionSchema);
const Class = mongoose.model('class', classSchema);

module.exports = { GradeComposition, Class };
