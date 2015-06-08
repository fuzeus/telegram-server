var express = require('express');
var usersRouter = express.Router();
var mongoose = require('../../db');
var passport = require('../../middleware/auth');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var md5 = require('MD5');
var Mailgun = require('mailgun-js');
var Handlebars = require('handlebars');
var sendResetPasswordEmail = require('../../emails');
var logger = require('nlogger').logger(module);

var api-key = 19a22b34e17857fb9f4ac91c39855bc8;
var domain = sandbox98739a374cb44e1ebef812d5f1dc7e9d.mailgun.org;
var from_who = tristan@fuzeus.com;

var User = mongoose.model('User');

usersRouter.get('/', function(req, res) {
  if (req.query.isAuthenticated) {
    if(req.isAuthenticated()) {
      res.send({
        users: [req.user]
      });
    } else{
      res.send({
        users: []
      })
    }
  } else if (req.query.followedBy || req.query.follows) {
    User.find({}, function(err, users) {
      return res.send({ users: users});
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
      return res.send({user: user});
    }
  });
});

usersRouter.post('/', function(req, res) {
  logger.info('Inside usersRouter post route');
  logger.debug('Entering post route to determine if operation is signup or login');

  if (req.body.user.meta.operation === 'signup') {
    bcrypt.hash(req.body.user.meta.password, 8, function (err, hash) {
      if (err) {
        res.sendStatus(500);
      }
      var user = new User({
        id: req.body.user.id,
        name: req.body.user.name,
        email: req.body.user.email,
        password: hash
      });
      user.save(function(err, newUser){
        if (err){return res.sendStatus(500);}
        else {
          req.logIn(user, function(err) {
            logger.info('Inside sign up authentication process');
            logger.debug('Entering req.logIn in order to set the cookie and prior to calling serializeUser');

            if (err) {
              return res.sendStatus(500);
            }
            res.send({
              user: newUser
            });
          })
        }
      });
    });
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
          user: user
        });
      });
    })(req, res);
  } else if (req.body.user.meta.operation === 'resetPassword') {
    var tempPassword = generatePassword();
    var hashmd5 = md5(tempPassword);
    bcrypt.hash(hashmd5, 8, function (err, hash) {
      if (err) {
        res.sendStatus(500);
      }
      User.findOneAndUpdate( {email: req.body.user.email},
      { $set: {password: hash }}, function (err, user) {
        sendResetPasswordEmail( user, tempPassword, function () {
          var mailgun = new Mailgun({apiKey: api_key, domain: domain});
          var data = {
            from: from_who,
            to: req.body.user.email,
            subject: 'Password Reset from Telegram',
            html: result
          }
          mailgun.messages().send(data, function (err, body) {
            if (err) {
              
            }
          })
          return res.send({user: user});
        });
      })
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
