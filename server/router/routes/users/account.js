var mongoose = require('../../../db')
  , passport = require('../../../middleware/auth')
  , sendResetPasswordEmail = require('../../../emails')
  , logger = require('nlogger').logger(module)
  , User = mongoose.model('User');

exports.getAuthenticatedUser = function (req, res) {
  if(req.isAuthenticated()) {
    res.send({
      users: [req.user.toClient()]
    });
  } else{
    res.send({
      users: []
    })
  }
}

exports.signUp = function (req, res) {
  User.createUser(req.body.user, function(err, user){
    if (err) {
      return res.sendStatus(500);
    }
    req.logIn(user, function(err) {
      logger.info('Inside sign up authentication process');
      logger.debug('Entering req.logIn in order to set the cookie and prior to calling serializeUser');

      if (err) {
        return res.sendStatus(500);
      }
      res.send({
        user: user.toClient()
      });
    })
  })
}

exports.logIn = function (req, res) {
  passport.authenticate('local', function(err, user, info) {
    logger.info('Inside passport.authenticate during login operation');
    logger.debug('Entering passport.authenticate prior to verify function');

    if (err) {
      return res.sendStatus(500);
    }
    if (!user) {
      return res.sendStatus(404);
    }
    req.logIn(user, function(err) {
      logger.info('Inside login authentication process');
      logger.debug('Entering req.logIn in order to set the cookie and prior to calling serializeUser');

      if (err) {
        return res.sendStatus(500);
      }
      res.send({
        user: user.toClient()
      });
    });
  })(req, res);
}

exports.resetPassword = function (req, res) {
  logger.debug('Entering resetPassword in order to reset the password. Calling static User.resetPassword');

  User.resetPassword(req.body.user, function (err, user, tempPassword) {
    sendResetPasswordEmail( user, tempPassword, function (err) {
      return res.send({user: user.toClient()});
    });
  });
}
