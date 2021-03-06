var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , mongoose = require('../db')
  , logger = require('nlogger').logger(module)
  , User = mongoose.model('User');

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
      user.comparePassword( password, function (err, res) {
        if (err) {
          logger.error(err);

          return done(err, false);
        }
        else if (!res) {
          return done(null, false, { message: 'Incorrect password.'});
        }
        else if (res) {
          return done(null, user);
        }
      })
    });
  }
));

module.exports = passport;
