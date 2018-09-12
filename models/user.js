const mongoose = require('mongoose');
var Article = require('./article')

var UserSchema = new mongoose.Schema({
  userID: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  }, 
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  imageURL: {
    type: String,
    required: true,
    trim: true
  },
  subscription: {
    type: [Number],
    required: true
  }
});

UserSchema.methods.addPublication = function addPublication (publicationID) {
  var index = this.subscription.indexOf(publicationID);

  // ID not found in subcription
  if (index < 0) {
    this.subscription.push(publicationID);
  }
}

UserSchema.methods.removePublication = function removePublication (publicationID) {
  var index = this.subscription.indexOf(publicationID);

  // ID found in subscription
  if (index > -1) {
    this.subscription.splice(index, 1);
  } 
}

UserSchema.methods.findSubscribedArticle = function findSubscribedArticle (page, callback) {
    Article.paginate(Article.find({publicationID: {$in : this.subscription}}), {page: page, limit: 10}, function (err, articles) {
        if (err) {
            return callback(err);
        }

        return callback(null, articles.docs);
    });
}

var User = mongoose.model('User', UserSchema);

module.exports = User;
