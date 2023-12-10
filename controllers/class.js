const Class = require('../models/class');
const User = require('../models/user');
const StatusCodes = require('http-status-codes');
const { ObjectId } = require('mongodb');

const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Create a new class
const createClass = async (req, res) => {
  try {
    const existingClass = await Class.findOne({
      'teachers.id': req.body.teacherId,
      className: req.body.className
    });

    if (existingClass) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "class_exist",
          message: 'Class with the same teacher and class name already exists.',
        },
      });
    }

    const classCode = generateRandomString(16); //16 letters
    const invitationCode = generateRandomString(Math.floor(Math.random() * (7 - 5 + 1)) + 5); // 5-7 letters
    const teacher = await User.findOne({ _id: new ObjectId(req.body.teacherId)});

    const newClass = await Class.create({
      className: req.body.className,
      section: req.body.section,
      subject: req.body.subject,
      room: req.body.room,
      teachers: [
        {
          id: req.body.teacherId,
          name: teacher.name
        }
      ], 
      classCode: classCode,
      invitationCode: invitationCode,
    });

    await newClass.save();
    return res.status(StatusCodes.CREATED).json({
      status: 201,
      data: newClass,
    });

  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      error: {
        code: "bad_request",
        message: err.message,
      },
    });
  }
};

// List class by teacherId
const listClassesByTeacherId = async (req, res) => {
  try {
    const teacherId = req.params.teacherId; 
    const classes = await Class.find({
      'teachers.id': teacherId
    });

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: classes,
    });

  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      error: {
        code: "bad_request",
        message: err.message,
      },
    });
  }
};

// Get class detail
const getClassByClassCode = async (req, res) => {
  try {
    const classCode = req.params.classCode; 

    const foundClass = await Class.findOne({ classCode });

    if (!foundClass) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: {
          code: "not_found",
          message: "Class not found with the classcode :" + classCode,
        },
      });
    }

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: foundClass,
    });

  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      error: {
        code: "bad_request",
        message: err.message,
      },
    });
  }
};

module.exports = { 
  createClass,
  listClassesByTeacherId,
  getClassByClassCode
};