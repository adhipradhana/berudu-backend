const router = require('express').Router();
var User = require('../models/user');
var Publication = require('../models/publication')
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

        res.redirect('/auth/google/success');
      }) (req, res)
  });       

// GET route if google login success
router.get('/auth/google/success', function (req, res) {
    const payload = {
        userID: req.session.user.userID
    };

    var token = jwt.sign(payload, privateKEY);

    res.json({
        token: token
    });
});

// middleware for authentication
router.use('/api', function (req, res, next) {
    // check for token
    var token = req.headers['x-access-token'];

    // decode token
    if (token) {
        jwt.verify(token, privateKEY, function(err, decoded) {
            if (err) {
                return res.json({
                    success: false, 
                    message: 'Failed to authenticate token.' 
                });
            } 

            // if everything is good, save to request for use in other routes
            req.userID = decoded.userID; 

            next();
        });
    } else {
        // if there is no token
        // return an error
        return res.json({ 
            success: false, 
            message: 'No token provided.' 
        });
    }
});

router.get('/api/profile', function (req, res) {
    User.findOne({userID : req.userID}, function(err, user) {
        if (err) {
            return res.json({
                success : false, 
                message: 'Internal server error'
            });
        }

        return res.json({
            name : user.name,
            email : user.email,
            imageURL : user.imageURL,
            subscription : user.subscription
        });
    });
});

router.post('/api/subs/add', function (req, res) {
    User.findOne({userID : req.userID}, function(err, user) {
        if (err) {
            return res.json({
                success : false, 
                message: 'Internal server error'
            });
        }

        if (!req.body.publicationID) {
            return res.json({
                success : false, 
                message: 'Publication ID not found'
            });
        }

        Publication.findOne({publicationID: req.body.publicationID}, function(err, publication) {
            if (err) {
                return res.json({
                    success : false, 
                    message: 'Internal server error'
                });
            }

            if (!publication) {
                return res.json({
                    success : false, 
                    message: 'Publication not found'
                });
            }

            // add user ID to publication
            publication.addSubscriber(user.userID);

            // save to database
            publication.save(function (err) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Unable to save to database'
                    });
                }

                // add publication
                user.addPublication(req.body.publicationID);

                // save to db
                user.save(function (err) {
                    if (err) {
                        return res.json({
                            success : false, 
                            message: 'Unable to save to database'
                        });
                    }

                    return res.json({
                        success : true,
                        message : 'success adding subscription',
                        subscription : user.subscription
                    });
                });
            });
        });
    });
});

router.post('/api/subs/delete', function (req, res) {
    User.findOne({userID: req.userID}, function(err, user) {
        if (err) {
            return res.json({
                success : false, 
                message: 'Internal server error'
            });
        }

         if (!req.body.publicationID) {
            return res.json({
                success : false, 
                message: 'Publication ID not found'
            });
        }

        Publication.findOne({publicationID: req.body.publicationID}, function(err, publication) {
            if (err) {
                return res.json({
                    success : false, 
                    message: 'Internal server error'
                });
            }

            if (!publication) {
                return res.json({
                    success : false, 
                    message: 'Publication not found'
                });
            }

            // add user ID to publication
            publication.removeSubscriber(user.userID);

            // save to database
            publication.save(function (err) {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Unable to save to database'
                    });
                }

                // add publication
                user.removePublication(req.body.publicationID);

                // save to db
                user.save(function (err) {
                    if (err) {
                        return res.json({
                            success : false, 
                            message: 'Unable to save'});
                    }

                    return res.json({
                        success : true,
                        message : 'success adding subscription',
                        subscription : user.subscription
                    });
                });
            });
        });
    });
});

// FOR TESTING OF COURSE
router.post('/publication/add', function(req, res) {
    var publication = new Publication({
        publicationID : req.body.publicationID,
        name : req.body.name,
        url : req.body.url,
        subscriber : []
    });

    publication.save(function (err) {
        if (err) {
            return res.json({
                success : false,
                message : 'Internal server error'
            });
        }

        return res.json({
            publicationID : publication.publicationID,
            name : publication.name,
            url : publication.url,
            subscriber : publication.subscriber
        });
    });
});

// FOR TESTING OF COURSE
router.post('/publication/delete', function(req, res) {
    Publication.deleteOne({publicationID: req.body.publicationID}, function (err) {
        if (err) {
           return res.json({
                success : false,
                message : 'Internal server error'
            }); 
        }

        return res.json({
            success : true,
            message : 'Deleting publication objectr'
        });
    }); 
});


module.exports = router;