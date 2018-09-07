const router = require('express').Router();
var User = require('../models/user');
var Publication = require('../models/publication')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// set private and public key
const privateKEY = fs.readFileSync('./config/jwtRS256.key', 'utf8');
const publicKEY = fs.readFileSync('./config/jwtRS256.key.pub', 'utf8');


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
        res.redirect('/auth/google/success');
      }) (req, res)
  });       

// GET route if google login success
router.get('/auth/google/success', function (req, res) {
  const payload = {
    userID: req.session.user.userID
  };

  var token = jwt.sign(payload, privateKEY);

  res.json({token: token});
});

// middleware for authentication
router.use('/api', function (req, res, next) {
    // check for token
    var token = req.headers['x-access-token'];

    // decode token
    if (token) {
        jwt.verify(token, privateKEY, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } 

            // if everything is good, save to request for use in other routes
            req.userID = decoded.userID; 

            next();
        });
    } else {
        // if there is no token
        // return an error
        return res.json({ success: false, message: 'No token provided.' });

    }
});

router.get('/api/profile', function (req, res) {
    User.findOne({userID : req.userID}, function(err, user) {
        if (err) {
            return res.json({success : false, message: 'Internal server error'});
        }
        if (!user) {
          return res.json({});
        }

        return res.json({
            name : user.name,
            email : user.email,
            imageURL : user.imageURL,
            subcription : user.subscription
        });
    });
});

router.get('/api/publication/:id', function (req, res) {
  Publication.findOne({publicationID: req.params.id}, function(err, publication) {
    if (err) {
      return res.json({success: false, message: 'Internal error'});
    }
    if (!publication) {
      return res.json({});
    }
    return res.json({
      name: publication.name,
      url: publication.url
    });
  });
});

module.exports = router;