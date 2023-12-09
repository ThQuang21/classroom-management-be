const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require('../models/user');

const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "https://classroom-management-be.vercel.app/auth/google/callback",
    },
    async(req, accessToken, refreshToken, profile, done) => {
      // console.log('profile', profile)
return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
    console.log('serializeUser', user)
    done(null, user);
  });
  
passport.deserializeUser(async (user, done) => {
  console.log('deserializeUser', currentUser)
  done(null, user);
});