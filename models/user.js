const mongoose = require('mongoose');

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
  this.subscription.push(publicationID);
}

UserSchema.methods.removePublication = function removePublication (publicationID) {
  this.subscription = this.subscription.filter(item => item != publicationID);
}

var User = mongoose.model('User', UserSchema);

module.exports = User;
