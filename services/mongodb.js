const mongoose = require('mongoose');
const keys = require('../config/keys');
var dbPath = keys.mongodbURI;
var dbPath_old = 'mongodb://localhost:27017/test';
var dbOptions = { useNewUrlParser: true };

mongoose.connect(dbPath, dbOptions);

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'DB Connection error:'));
db.once('open', function () {
	console.log('Connected to DB!')
});

module.exports = db;