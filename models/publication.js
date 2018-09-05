const mongoose = require('mongoose');

var PublicationSchema = new mongoose.schema({
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

var Publication = mongoose.model('Publication', PublicationSchema);

module.exports = Publication;