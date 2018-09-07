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

var User = mongoose.model('User', UserSchema);

module.exports = User;
