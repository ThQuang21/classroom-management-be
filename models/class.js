const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  teachers: [
    {
      type: String,
    }
  ],
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
});

module.exports = mongoose.model("class", classSchema);
