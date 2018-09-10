const mongoose = require('mongoose');
var Article = require('./article')

var PublicationSchema =  new mongoose.Schema({
	publicationID: {
		type: Number,
	    unique: true,
	    required: true,
	},
	name: {
		type: String,
		required: true,
		trim : true
	},
	url: {
		type: String,
		required: true,
		trim : true
	},
	subscriber: {
		type: [String],
		required: true
	}
});

PublicationSchema.methods.addSubscriber = function addSubscriber (userID) {
  var index = this.subscriber.indexOf(userID);

  // ID not found in subscriber
  if (index < 0) {
    this.subscriber.push(userID);
  }
}

PublicationSchema.methods.removeSubscriber = function removeSubscriber (userID) {
  var index = this.subscriber.indexOf(userID);

  // ID found in subscriber
  if (index > -1) {
    this.subscriber.splice(index, 1);
  } 
}

PublicationSchema.methods.findPublicationArticle = function findPublicationArticle (callback) {
	Article.find({publicationID: this.publicationID}, function (err, articles) {
		if (err) {
			return callback(err);
		}

		return callback(null, articles);
	});
}

var Publication = mongoose.model('Publication', PublicationSchema);

module.exports = Publication;