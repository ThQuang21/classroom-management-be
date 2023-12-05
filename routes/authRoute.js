const express = require('express');
const router = express.Router();
const { 
    register, login, activateAccount, resentCode, forgotPassword, 
    resetPassword
} = require('../controllers/auth');
const passport = require("passport");
const jwt = require('jsonwebtoken');


const CLIENT_URL = "https://classroom-management-fe.vercel.app"
// const CLIENT_URL = "http://localhost:3001/"

router.post('/register', register);
router.post('/login', login);

router.get('/activate/:email/:userToken', activateAccount);
router.post('/activate/resent-code', resentCode);

router.patch('/forgot-password', forgotPassword);
router.patch('/reset-password', resetPassword);

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
  }), (req, res) => {
    // res.redirect(CLIENT_URL);

    if (req.user) {
      const token = jwt.sign({ userId: req.user._id, email: req.user.email }, process.env.SECRET_KEY, { expiresIn: '12h' });

      const userData = JSON.stringify({
        id: req.user.id,
        name: req.user.name.familyName + ' ' + req.user.name.givenName,
        email: req.user.email,
        status: 'ACTIVE',
        accessToken: token,
      });
          // console.log("userData", userData)
      res.redirect(CLIENT_URL + `/handleUserData?userData=${userData}`);
    }


});



module.exports = router;