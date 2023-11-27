const mongoose = require("mongoose")

var connectString = process.env.DATABASE_URL

const connect = mongoose.connect(connectString)
connect
  .then(db => {
    console.log("Connected to db")
  })
  .catch(err => {
    console.log(err)
  })