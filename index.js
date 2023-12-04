const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const flash = require("express-flash")
const authRoutes = require('./routes/authRoute');
const session = require('express-session')
const passport = require('passport')

require("dotenv").config();
require("./utils/connectDB")

const app = express()
app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));
app.use(passport.initialize());
app.use(passport.session());

const port = 3000


app.get('/', (req, res) => {
  res.send('Classroom Management')
})

// Authentication routes
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})