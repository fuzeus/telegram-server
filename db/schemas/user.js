var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var md5 = require('MD5');
var generatePassword = require('password-generator');
var logger = require('nlogger').logger(module);

var userSchema = mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  photo: String,
  following: {type: [], default: []}
});

userSchema.methods.toClient = function (authenticatedUser) {
  var user = {
      id: this.id,
      name: this.name,
      photo: this.photo,
      followedByAuthenticatedUser: false
  }
  if (authenticatedUser) {
    var found = false;
    authenticatedUser.following.forEach( function(userId) {
      if (user.id === userId) {
        found = true;
      }
    })
    user.followedByAuthenticatedUser = found;
  }
  logger.debug('user', user, authenticatedUser);

  return user;
}

userSchema.methods.comparePassword = function (password, next) {
  bcrypt.compare(password, this.password, next);
}

userSchema.statics.encryptPassword = function (password, next) {
  bcrypt.hash(password, 8, next);
}

userSchema.statics.createUser = function (user, next) {
  var User = this.model('User');
  User.encryptPassword(user.meta.password, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    User.create(user, next);
  });
}

userSchema.statics.resetPassword = function (user, next) {
  logger.debug('Entering static resetPassword in order to generate new password');

  var User = this.model('User');
  var tempPassword = generatePassword();
  var hashmd5 = md5(tempPassword);
  User.encryptPassword( hashmd5, function(err, hash) {
    if (err) {
      return next(err);
    }
    User.findOneAndUpdate( {email: user.email},
    { $set: {password: hash }}, function (err, user) {
      return next( err, user, tempPassword);
    });
  })
}

module.exports = userSchema;
