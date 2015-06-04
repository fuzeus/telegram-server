var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('../db');
var logger = require('nlogger').logger(module);

var User = mongoose.model('User');

passport.serializeUser(function(user, done) {
  logger.info('Inside serializeUser in order to provide unique info for the cookie');
  logger.debug('Entering serializeUser with the following arguments, user, done');

  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  logger.info('Inside deserializeUser in order to extract unique info from the cookie');
  logger.debug('Entering deserializeUser with the following arguments, id, done');

  User.findOne({id: id}, function(err, user) {
    if (err) {
      return done(err);
    }
    return done(null, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'user[id]',
  passwordField: 'user[meta][password]'
},
  function(id, password, done) {
    logger.debug('Entering the verify function with the following arguments, username, password');

    User.findOne({ id: id }, function(err, user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.'});
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.'});
      }
      return done(null, user);
    });
  }
));

module.exports = passport;
