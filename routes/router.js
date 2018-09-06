const router = require('express').Router();
var User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// set private and public key
var privateKEY = fs.readFileSync('./config/jwtRS256.key', 'utf8');
var publicKEY = fs.readFileSync('./config/jwtRS256.key.pub', 'utf8');


// GET route for reading data
router.get('/', function (req, res) {
  return res.send('Hello Berudu!');
});

//GET route for login with Google
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

//GET route for google callback
router.get('/auth/google/callback', function(req, res) {
      passport.authenticate('google', function(err, user) {
        if (err) {
          res.redirect('/');
        }
        req.session.user = user;
        res.redirect('/success');
      }) (req, res)
  });       

// GET route after registering
router.get('/success', function (req, res) {
  const payload = {
    userID: req.session.user.userID
  };

  console.log(router.get('privateKEY'));

  var token = jwt.sign(payload, privateKEY);

  res.json({token: token});
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
});

module.exports = router;