const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
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
}, {collection: 'publication'});

PublicationSchema.plugin(mongoosePaginate);

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

PublicationSchema.methods.findPublicationArticle = function findPublicationArticle (page, callback) {
	Article.paginate(Article.find({publicationID: this.publicationID}), {page: page, limit: 10}, function(err, articles) {
		if (err) {
			return callback(err);
		}

		return callback(null, articles.docs);
	});
}

PublicationSchema.statics.getAll = function getAll (page, callback) {
	Publication.paginate({}, {page: page, limit: 10}, function(err, publications) {
		if (err) {
			return callback(err);
		}

		return callback(null, publications.docs);
	});
}

var Publication = mongoose.model('Publication', PublicationSchema);

module.exports = Publication;
