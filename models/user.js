const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      activeCode: {
        type: String
      },
      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
      },
      status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'INACTIVE'
      }
    },
    { timestamps: true }
  );
  
module.exports = mongoose.model("user", userSchema);