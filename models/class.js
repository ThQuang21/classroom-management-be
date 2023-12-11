const mongoose = require('mongoose');

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
});

module.exports = mongoose.model("class", classSchema);
