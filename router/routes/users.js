var express = require('express');
var usersRouter = express.Router();
var mongoose = require('../../db');
var passport = require('../../middleware/auth');
var LocalStrategy = require('passport-local').Strategy;
var sendResetPasswordEmail = require('../../emails');
var logger = require('nlogger').logger(module);

var User = mongoose.model('User');

usersRouter.get('/', function(req, res) {
  if (req.query.isAuthenticated) {
    if(req.isAuthenticated()) {
      res.send({
        users: [req.user] //Should toClient be used here on an array with one object?
      });
    } else{
      res.send({
        users: []
      })
    }
  } else if (req.query.followedBy || req.query.follows) {
    User.find({}, function(err, users) {
      var clientUsers = users.map(function(user){
        return user.toClient();
      });
      return res.send({ users: clientUsers});
    });
  } else {
    return res.status(403).send('Forbidden!');
  }
});

usersRouter.get('/:id', function(req, res) {
  User.findOne({id: req.params.id}, function (err, user) {
    if (err) {
      return res.sendStatus(500);
    } else {
      return res.send({user: user.toClient()});
    }
  });
});

usersRouter.post('/', function(req, res) {
  logger.info('Inside usersRouter post route');
  logger.debug('Entering post route to determine if operation is signup or login');

  if (req.body.user.meta.operation === 'signup') {
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
  } else if (req.body.user.meta.operation === 'login') {
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
  } else if (req.body.user.meta.operation === 'resetPassword') {
    logger.debug('Entering resetPassword in order to reset the password. Calling static User.resetPassword');
    
    User.resetPassword(req.body.user, function (err, user, password) {
      sendResetPasswordEmail( user, tempPassword, function (err) {
        return res.send({user: user.toClient()});
      });
    });
  }
});

usersRouter.put('/:id', function(req, res) {
  var id = req.params.id;
  var user = req.body.user || {};
  user.id = id;

  if (user.meta.operation === 'follow' || user.meta.operation === 'unfollow') {
    return res.send({
      user: user
    });
  } else {
    return res.status(404).send('Invalid operation!');
  }
});

module.exports = usersRouter;
