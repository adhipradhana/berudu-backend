const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


//connect to passport.js
require('./services/passport');

//connect to MongoDB
var dbPath = 'mongodb://localhost:27017/test';
var dbOptions = { useNewUrlParser: true };

mongoose.connect(dbPath, dbOptions);

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'DB Connection error:'));
db.once('open', function () {
	console.log('Connected to DB!')
});

// use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('404: File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});