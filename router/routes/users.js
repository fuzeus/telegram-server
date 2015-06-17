var express = require('express');
var usersRouter = express.Router();
var mongoose = require('../../db');
var passport = require('../../middleware/auth');
var LocalStrategy = require('passport-local').Strategy;
var sendResetPasswordEmail = require('../../emails');
var logger = require('nlogger').logger(module);
var ensureAuthenticated = require('../../middleware/ensureAuthenticated');

var User = mongoose.model('User');

usersRouter.get('/', function(req, res) {
  if (req.query.isAuthenticated) {
    if(req.isAuthenticated()) {
      res.send({
        users: [req.user.toClient()]
      });
    } else{
      res.send({
        users: []
      })
    }
  } else if (req.query.following) { //This is for retrieving follow lists. separate these. For req.query.follows, retrieve user matching the id and user.following
    User.findOne({id: req.query.following}, function (err, user) {
      if (err) {
        return res.sendStatus(500);
      }
      User.find({id: {$in: user.following}}, function (err, users) {
        if (err) {
          return res.sendStatus(500);
        }
        var clientUsers = users.map(function(user){
          return user.toClient(req.user);
        });
        return res.send({ users: clientUsers});
      })
    });
  } else if (req.query.followers){
    User.find({following: req.query.followers}, function (err, users) {
      if (err) {
        return res.sendStatus(500);
      }
      var clientUsers = users.map(function(user){
        return user.toClient(req.user);
      })
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
      return res.send({user: user.toClient(req.user)});
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

    User.resetPassword(req.body.user, function (err, user, tempPassword) {
      sendResetPasswordEmail( user, tempPassword, function (err) {
        return res.send({user: user.toClient()});
      });
    });
  }
});

usersRouter.put('/:id', ensureAuthenticated, function(req, res) {
  var id = req.params.id;
  //User.findOneAndUpdate and $addToSet the following user id. Ember is expecting back req.body.user. Have to add the flag for followedByAuthenticatedUser
  var user = req.body.user || {}; //user that was just followed
  logger.debug('user', user);
  user.id = id;
  if (user.meta.operation === 'follow') { //separate these by the flag true or false
    user.followedByAuthenticatedUser = true;
    User.findOneAndUpdate({id: req.user.id}, {$addToSet: {following: user.id}}, function (err) {
      if (err) {
        return res.sendStatus(500);
      } //
      return res.send({
        user: user
      });
    })
    //for unfollow, use findOneAndUpdate and $pull to pull the id from the array
  } else if (user.meta.operation === 'unfollow') {
    user.followedByAuthenticatedUser = false;
    User.findOneAndUpdate({id: req.user.id}, {$pull: {following: user.id }}, function (err) {
      if (err) {
        return res.sendStatus(500);
      }
      return res.send({
        user: user
      })
    })
  } else {
    return res.status(404).send('Invalid operation!');
  }
});

module.exports = usersRouter;
