const mongoose = require('mongoose')

var ArticleSchema = new mongoose.Schema({
	publicationID: {
		type: Number,
		required: true
	},
	title: {
		type: String,
		trim: true,
		required: true
	}
});