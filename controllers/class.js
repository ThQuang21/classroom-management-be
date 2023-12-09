const Class = require('../models/class');
const StatusCodes = require('http-status-codes');

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
    console.log(req.body)
    const classCode = generateRandomString(16); //16 letters
    const invitationCode = generateRandomString(Math.floor(Math.random() * (7 - 5 + 1)) + 5); // 5-7 letters

    const newClass = await Class.create({
      className: req.className,
      section: req.body.section,
      subject: req.body.subject,
      room: req.body.room,
      teachers: [req.body.teacherId], 
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

module.exports = { 
  createClass
};