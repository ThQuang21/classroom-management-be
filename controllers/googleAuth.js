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

      const newUser = {
        email: profile.emails[0].value,
        name: profile.name.familyName + ' ' + profile.name.givenName,
        status: 'ACTIVE',
        socialLogins: [
          {
            provider: 'GOOGLE', 
            socialId: profile.id,
          },
        ],
      };

      try {
        const existingUser = User.findOne({ email: profile.email });
        console.log("existingUser", existingUser)
        
        if (existingUser) {
          return done(null, profile);

        } else {
          const createdUser = await User.create(newUser);
          createdUser.save()
          return done(null, profile);
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
  
passport.deserializeUser(async (user, done) => {
  const currentUser = await User.findOne({id});
  console.log('deserializeUser', currentUser)
  done(null, currentUser);
});