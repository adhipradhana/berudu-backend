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


UserSchema.statics.findUser = function (email) {
    User.findOne({ email: email }, function (err, user) {
        if (err) {
            return err;
        } 

        return user;
    });
}

var User = mongoose.model('User', UserSchema);

module.exports = User;
