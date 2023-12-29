const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const GOOGLE_CLIENT_ID = process.env.CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET;

FACEBOOK_APP_ID = process.env.FACEBOOK_CLIENT_ID;
FACEBOOK_APP_SECRET = process.env.FACEBOOK_CLIENT_SECRET;


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

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "https://classroom-management-be.vercel.app/auth/facebook/callback",
      profile: ['id', 'displayName'] // You have the option to specify the profile objects you want returned
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
    console.log('serializeUser', user)
    done(null, user);
  });
  
passport.deserializeUser(async (user, done) => {
  console.log('deserializeUser', user)
  done(null, user);
});