require('dotenv').config();
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user');

const applyPassportStrategy = (passport) => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY ? process.env.SECRET_KEY : '',
  };

  passport.use(
    new Strategy(options, async (payload, done) => {
      try {
        // console.log(payload)

        const existingUser = await User.findOne({ email: payload.email });
        // console.log(existingUser)

        if (!existingUser) {
          return done(null, false);
        }

        return done(null, {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          studentId: existingUser.studentId,
          status: existingUser.status,
          socialLogins: existingUser.socialLogins
        });
      } catch (err) {
        return done(err, false);
      }
    })
  );
};

module.exports = { applyPassportStrategy };
