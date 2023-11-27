const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const authRoutes = require('./routes/authRoute');

require("dotenv").config();
require("./utils/connectDB")

const app = express()
app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json())
app.use(cookieParser(process.env.COOKIE_SECRET))

const port = 3000

app.get('/', (req, res) => {
  res.send('Classroom Management')
})

// Authentication routes
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})