const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require('express-session')
const passport = require('passport')

const authRoutes = require('./routes/authRoute');
const classRoutes = require('./routes/classRoute');
const gradeRoutes = require('./routes/gradeRoute');

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

app.use('/auth', authRoutes); // Authentication routes
app.use('/classes', classRoutes); // Class routes
app.use('/grades', gradeRoutes); // Grade routes

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})