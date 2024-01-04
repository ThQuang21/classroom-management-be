const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require('express-session')
const passport = require('passport')
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoute');
const classRoutes = require('./routes/classRoute');
const gradeRoutes = require('./routes/gradeRoute');
const gradeReviews = require('./routes/gradeReviewRoute');
const notifications = require('./routes/notificationRoute');
const applyPassportStrategy = require("./utils/passport")

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
applyPassportStrategy.applyPassportStrategy(passport);

const port = 3000

const http = require("http");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  },
});

io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
});
io.on("identity", (userId) => {
  console.log(`User connected ${socket.id}`);
  console.log(`User connected ${userId}`);
});

app.get('/', (req, res) => {
  res.send('Classroom Management')
})

app.use('/auth', authRoutes); // Authentication routes
app.use("/classes", classRoutes); // Class routes
app.use("/grades", passport.authenticate("jwt", { session: false }), gradeRoutes); // Grade routes
app.use("/gradeReviews", passport.authenticate("jwt", { session: false }), gradeReviews); // Grade routes
app.use("/notifications", passport.authenticate("jwt", { session: false }), notifications); // Notification routes

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})