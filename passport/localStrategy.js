const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User          = require('../models/User');
const bcrypt        = require('bcrypt');

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, 
  (username, password, done) => {
    User.findOne({ username })
    .then(foundUser => {
      if (!foundUser) {
        done(null, false, { message: 'Incorrect username' });
        return;
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        done(null, false, { message: 'Incorrect password' });
        return;
      }

      done(null, foundUser);
    })
    .catch(err => done(err));
  }
));

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.ENDPOINT}/facebook/callback`,
      profileFields: ["id", "displayName", "photos", "email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ facebook_id: profile.id }).catch(err =>
        done(err)
      );
      if (!user) {
        const newUser = await User.create({
          facebook_id: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          photoURL: profile.photos[0].value
        }).catch(err => done(err));
        done(null, newUser);
      } else {
        done(null, user);
      }
    }
  )
);
