const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true
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
      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
      },
      status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
      }
    },
    { timestamps: true }
  );
  
module.exports = mongoose.model("user", userSchema);