const mongoose = require('mongoose');
const article = require('./article');

var PublicationSchema = new mongoose.Schema({
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
	}
});

PublicationSchema.statics.findPublication = function(publicationID) {
	Publication.findOne({ publicationID: publicationID }, function(err, publication) {
		if (err) {
			return err;
		}

		return publication;
	});
}

PublicationSchema.methods.findArticleFromPublication = function() {
	Article.find({ publicationID: this.publicationID}, function(err, articles) {
		if (err) {
			return err;
		}

		return articles;
	});
}

var Publication = mongoose.model('Publication', PublicationSchema);

module.exports = Publication;