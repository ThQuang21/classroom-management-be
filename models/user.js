const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true
      },
      studentId: {
        type: String
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String
      },
      userToken: {
        type: String
      },
      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
      },
      status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'BAN'],
        default: 'INACTIVE'
      },
      socialLogins: [
        {
          provider: {
            type: String,
            enum: ['GOOGLE', 'FACEBOOK'],
          },
          socialId: String,
        },
      ],
    },
    { timestamps: true }
  );
  
module.exports = mongoose.model("user", userSchema);