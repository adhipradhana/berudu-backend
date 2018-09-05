const passport = require('passport')
const keys = require('../config/keys')
const GoogleStrategy = require('passport-google-oauth20')

//use Google OAuth 2.0 strategy for login
passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    console.log("accessToken :", accessToken);
    console.log("refreshToken :", refreshToken);
    console.log("profile :", profile);
  })
);