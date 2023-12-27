const express = require('express');
const router = express.Router();
const { 
    register, login, activateAccount, resentCode, forgotPassword, findUserByEmail,
    resetPassword, updateStudentId, updateProfile, getAllUsers, banUser, activeUser,
    loginAdmin
} = require('../controllers/auth');
const passport = require("passport");
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const CLIENT_URL = "https://classroom-management-fe.vercel.app"
// const CLIENT_URL = "http://localhost:3001/"

router.get('/getAllUsers', getAllUsers);

router.post('/register', register);
router.post('/login', login);
router.post('/loginAdmin', loginAdmin);


router.get('/activate/:email/:userToken', activateAccount);
router.post('/activate/resent-code', resentCode);
router.put('/banUser/:email', banUser);
router.put('/activeUser/:email', activeUser);


router.patch('/forgot-password', forgotPassword);
router.patch('/reset-password', resetPassword);
router.patch('/student-id', updateStudentId);
router.patch('/profile', updateProfile)
router.get('/find-by-email/:email', findUserByEmail);


// Google login 
require("../controllers/googleAuth")

router.get("/login/success", (req,res) => {
  if(req.user) {
    res.status(200).json({
        success:true,
        message: "successful",
        user: req.user,
        //cookies: req.cookies
    });
  }
});

router.get("/login/failed", (req,res) => {
  res.status(401).json({
      success:false,
      message: "failure",
  });
});

router.get("/logout", (req, res) => {
 req.logout();
 res.redirect(CLIENT_URL);
});

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  failureRedirect: '/login'  
}));

router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: CLIENT_URL + '/login',
  failureFlash: true
  }), async (req, res) => {
    // res.redirect(CLIENT_URL);

    console.log("req.user", req.user)

    const newUser = {
      email: req.user.email,
      name: req.user.displayName,
      status: 'ACTIVE',
      socialLogins: [
        {
          provider: 'GOOGLE', 
          socialId: req.user.id,
        },
      ],
    };

    try {
      let existingUser = await User.findOne({ email: req.user.email });
    
      if (!existingUser) {
        existingUser = await User.create(newUser);
      }
      const token = jwt.sign({ userId: existingUser._id, email: existingUser.email }, process.env.SECRET_KEY, { expiresIn: '12h' });
      
      const userData = JSON.stringify({
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        studentId: existingUser.studentId,
        status: 'ACTIVE',
        accessToken: token,
        socialLogins: [
          {
            provider: 'GOOGLE', 
            socialId: req.user.id,
          },
        ],
      });
      
      console.log("userData", userData)
      res.redirect(CLIENT_URL + `/handleUserData?userData=${userData}`);
      
    } catch (error) {
      console.error(error);
    }
});



module.exports = router;