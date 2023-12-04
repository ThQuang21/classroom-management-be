const express = require('express');
const router = express.Router();
const { 
    register, login, activateAccount, resentCode, forgotPassword, 
    resetPassword
} = require('../controllers/auth');
const passport = require("passport");


const CLIENT_URL = "https://classroom-management-fe.vercel.app"


router.post('/register', register);
router.post('/login', login);

router.get('/activate/:email/:userToken', activateAccount);
router.post('/activate/resent-code', resentCode);

router.patch('/forgot-password', forgotPassword);
router.patch('/reset-password', resetPassword);

// Google login 
require("../controllers/googleAuth")

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  failureRedirect: '/login'  
}));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: CLIENT_URL,
  failureRedirect: CLIENT_URL + '/login',
  failureFlash: true
}));


module.exports = router;