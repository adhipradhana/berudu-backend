const api = require('express').Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');

var User = require('../models/user');
var Publication = require('../models/publication')

// set private and public key
const privateKEY = fs.readFileSync('./config/jwtRS256.key', 'utf8');
const publicKEY = fs.readFileSync('./config/jwtRS256.key.pub', 'utf8');

// middleware for authentication
api.use('/', function (req, res, next) {
    // check for token
    var token = req.headers['x-access-token'];

    // decode token
    if (token) {
        jwt.verify(token, privateKEY, function(err, decoded) {
            if (err) {
                return res.status(401).json({
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
        return res.status(401).json({
            message : 'Token not found'
        });
    }
});

api.get('/profile', function (req, res) {
    User.findOne({userID : req.userID}, function(err, user) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }
        if (!user) {
          return res.json({});
        }

        return res.json({
            name : user.name,
            email : user.email,
            imageURL : user.imageURL,
            subscription : user.subscription
        });
    });
});

api.post('/subscription/add', function (req, res) {
    User.findOne({userID : req.userID}, function(err, user) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        if (!req.body.publicationID) {
            return res.status(404).json({
                message: 'Publication ID not found'
            });
        }

        Publication.findOne({publicationID: req.body.publicationID}, function(err, publication) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            if (!publication) {
                return res.status(404).json({
                    message: 'Publication not found'
                });
            }

            // add user ID to publication
            publication.addSubscriber(user.userID);

            // save to database
            publication.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }

                // add publication
                user.addPublication(req.body.publicationID);

                // save to db
                user.save(function (err) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Internal server error'
                        });
                    }

                    return res.json({
                        message : 'Success adding subscription',
                        subscription : user.subscription
                    });
                });
            });
        });
    });
});

api.post('/subscription/delete', function (req, res) {
    User.findOne({userID: req.userID}, function(err, user) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

         if (!req.body.publicationID) {
            return res.status(404).json({
                message: 'Publication ID not found'
            });
        }

        Publication.findOne({publicationID: req.body.publicationID}, function(err, publication) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            if (!publication) {
                return res.status(404).json({
                    message: 'Publication not found'
                });
            }

            // add user ID to publication
            publication.removeSubscriber(user.userID);

            // save to database
            publication.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }

                // add publication
                user.removePublication(req.body.publicationID);

                // save to db
                user.save(function (err) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Internal server error'});
                    }

                    return res.json({
                        message : 'Success deleting subscription',
                        subscription : user.subscription
                    });
                });
            });
        });
    });
});

api.get('/publication/feed', function (req, res) {
    Publication.findOne({publicationID: req.query.id}, function (err, publication) {
        if (err) {
           return res.status(500).json({
                message : 'Internal server error'
            });
        }

        if (!publication) {
            return res.status(404).json({
                message : 'Publication not found'
            });
        }

        publication.findPublicationArticle(req.query.page, function (err, articles) {
            if (err) {
                return res.status(500).json({
                    message : 'Internal server error'
                });
            }

            return res.json({
                articles : articles
            });
        });
    });
});

api.get('/subscription/feed', function (req, res) {
    User.findOne({userID: req.userID}, function (err, user) {
        if (err) {
            return res.status(500).json({
                message : 'Internal server error'
            });
        }

        if (!user) {
            return res.status(404).json({
                message : 'User not found'
            });
        }

        user.findSubscribedArticle(req.query.page, function (err, articles) {
            if (err) {
                return res.status(500).json({
                    message : 'Internal server error'
                });
            }

            return res.json({
                articles : articles
            });
        });
    });
});