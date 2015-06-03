var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  photo: String,
  followedByAuthenticatedUser: Boolean
});

module.exports = userSchema;
