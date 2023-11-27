const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const StatusCodes = require('http-status-codes');
const User = require('../models/user');
const {RegisterSchema} = require('../validators/registerSchema');
const {LoginSchema} = require('../validators/loginSchema');
require("dotenv").config();

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
    const userCreated = await User.create({
      password: hashedPassword,
      email: req.body.email,
      name: req.body.name
    });
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
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
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
          code: "invalid_password",
          message: "Password is not correct",
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
        status: existingUser.status,
        accessToken: token,
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


module.exports = { register, login };