const passport = require('passport')
const keys = require('../config/keys')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/user')

//use Google OAuth 2.0 strategy for login
passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  }, 
  function (accessToken, refreshToken, profile, done) {
  	User.findOne({
  		userID : profile.id, 
  		name : profile.displayName, 
  		email : profile.emails[0].value,
  		imageURL : profile.photos[0].value}, function(err, user) {
  			return done(err, user);
  		});
  })
);