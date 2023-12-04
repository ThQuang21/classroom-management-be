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
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      //console.log('profile', profile)

      const newUser = {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.name.familyName + ' ' + profile.name.givenName,
        status: 'ACTIVE'
      };

      try {
        const existingUser = User.findOne({ email: profile.email });

        //console.log("existingUser", existingUser)

        if (existingUser) {
          done(null, profile);

        } else {
          existingUser = User.create(newUser);
          done(null, profile);
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
    console.log('serializeUser', user)
    done(null, user);
  });
  
passport.deserializeUser((user, done) => {
  console.log('deserializeUser', user)
  done(null, user);
});