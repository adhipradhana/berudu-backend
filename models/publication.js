const mongoose = require('mongoose');
const article = require('article');

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

var Publication = mongoose.model('Publication', PublicationSchema);

module.exports = Publication;