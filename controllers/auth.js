const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const StatusCodes = require('http-status-codes');
const User = require('../models/user');
const {RegisterSchema} = require('../validators/registerSchema');
const {LoginSchema} = require('../validators/loginSchema');
const { sendActivateEmail } = require('../utils/sendEmailActive');
const { sendEmailResetPwd } = require('../utils/sendEmailResetPwd');
const { Class } = require('../models/class');
require("dotenv").config();

function generateOTP() { 
  var digits = '0123456789'; 
  let OTP = ''; 
  for (let i = 0; i < 6; i++ ) { 
      OTP += digits[Math.floor(Math.random() * 10)]; 
  } 
  return OTP; 
} 

// Register a new user
const register = async (req, res) => {
  try {
    await RegisterSchema.validateAsync({ ...req.body });
  
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        error: {
          code: "email_exist",
          message: "Email existed",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const OTPCode = generateOTP();
    const userCreated = await User.create({
      password: hashedPassword,
      email: req.body.email,
      name: req.body.name,
      userToken: OTPCode
    });

    const sendCode = await sendActivateEmail(req.body.name, req.body.email, OTPCode);
    if (sendCode.error) {
      await User.deleteOne({email : req.body.email});
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: {
          message: 'Failed to send email'
        },
      });
    }
    await userCreated.save();

    return res.status(StatusCodes.CREATED).json({
      status: 201,
      data: {
        id: userCreated.id,
        name: userCreated.name,
        email: userCreated.email,
        status: userCreated.status,
      },
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

// Log in user
const login = async (req, res) => {
  try {
    await LoginSchema.validateAsync({ ...req.body });

    //find user by email
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: {
          code: "invalid_email",
          message: "User doesn't exist",
        },
      });
    }

    //check if pwd is correct
    const isValidPassword = await bcrypt.compare(req.body.password, existingUser.password);
    if (!isValidPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        error: {
          code: "invalid_credential",
          message: "Invalid credentials",
        },
      });
    }

    //check status user
    if (existingUser.status === "INACTIVE") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        error: {
          code: "user_inactive",
          message: "User need to be activated",
        },
      });
    }

    //create token for valid user
    const token = jwt.sign({ userId: existingUser._id, email: existingUser.email }, process.env.SECRET_KEY, { expiresIn: '12h' });
    return res.status(StatusCodes.OK).json({
      status: 200,
      data: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        studentId: existingUser.studentId,
        status: existingUser.status,
        accessToken: token,
        socialLogins: existingUser.socialLogins
      },
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
}

//Activate user
const activateAccount = async (req, res) => {
  try {
    //find user by email
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: {
          code: "invalid_user",
          message: "User doesn't exist",
        },
      });
    }
    //Check activate code
    if (req.params.userToken !== user.userToken) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: StatusCodes.FORBIDDEN,
        error: {
          code: "invalid_code",
          message: "Invalid code",
        },
      });
    }

    //Check user status
    if (user.status === "ACTIVE") {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: StatusCodes.FORBIDDEN,
        error: {
          code: "user_activated",
          message: "User is activated",
        },
      });
    }

    user.status = 'ACTIVE';
    await user.save();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Activate account success"
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
}

const resentCode = async (req, res) => {
  try {
    //find user by email
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: {
          code: "invalid_email",
          message: "User doesn't exist",
        },
      });
    }

    const sendCode = await sendActivateEmail(existingUser.name, req.body.email, existingUser.userToken);
    if (sendCode.error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: {
          message: 'Failed to send email'
        },
      });
    }

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Send email success"
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
}

const forgotPassword = async (req, res) => {
  try {
    //find user by email
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: {
          code: "invalid_email",
          message: "User doesn't exist",
        },
      });
    }

    const OTPCode = generateOTP();
    const sendCode = await sendEmailResetPwd(existingUser.name, req.body.email, OTPCode);
    if (sendCode.error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: {
          message: 'Failed to send email'
        },
      });
    }

    existingUser.userToken = OTPCode;
    await existingUser.save();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "We will send you an email to reset your password"
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
}

const resetPassword = async (req, res) => {
  try {
    //find user by email
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: {
          code: "invalid_email",
          message: "User doesn't exist",
        },
      });
    }

    console.log(req.body.userToken)
    console.log(existingUser.userToken)
    //Check user token
    if (req.body.userToken !== existingUser.userToken) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: StatusCodes.FORBIDDEN,
        error: {
          code: "invalid_code",
          message: "Invalid code",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    existingUser.password = hashedPassword;
    existingUser.userToken = null;

    await existingUser.save();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Password has been changed"
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
}
const updateStudentId = async (req, res) => {
  try {
    //find user by email
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: {
          code: "invalid_email",
          message: "User doesn't exist",
        },
      });
    }

    existingUser.studentId = req.body.studentId;
    await existingUser.save();

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Update student ID successfully"
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
}

const updateProfile = async (req, res) => {
  try { 
    console.log(req.body)
    const userUpdate = await User.findOne({email: req.body.email})

    userUpdate.name = req.body.name;
    userUpdate.studentId = req.body.studentId;

    userUpdate.save();

    // Update the class owner name in the class schema
    const classUpdate = await Class.findOne({ 'classOwner.id': userUpdate.id });
    console.log(classUpdate)
    if (classUpdate) {
      // Update the classOwner name
      classUpdate.classOwner.name = req.body.name;
      await classUpdate.save();
    }

    const classUpdateTeachers = await Class.updateMany(
      { 'teachers.id': userUpdate.id },
      { $set: { 'teachers.$.name': req.body.name } }
    );

    return res.status(StatusCodes.OK).json({
      status: 200,
      data: {
        id: userUpdate.id,
        name: userUpdate.name,
        studentId: userUpdate.studentId,
        email: userUpdate.email,
        status: userUpdate.status,
        socialLogins: userUpdate.socialLogins
      },
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
}

const findUserByEmail = async (req, res) => {
  try {
    //find user by email
    const existingUser = await User.findOne({ email: req.params.email });
    if (!existingUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        error: {
          code: "invalid_email",
          message: "User doesn't exist",
        },
      });
    }


    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: existingUser
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
}

module.exports = { 
  register, login, activateAccount, resentCode, findUserByEmail,
  forgotPassword, resetPassword, updateStudentId, updateProfile
};