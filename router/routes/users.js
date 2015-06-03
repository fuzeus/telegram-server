var express = require('express');
var app = express();
var usersRouter = express.Router();
var mongoose = require('../db');
var logger = require('nlogger').logger(module);

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
        // if you want to always be logged in

        // if you don't want to be logged in
        //res.send({users: []});
    } else if (req.query.followedBy || req.query.follows) {
        User.find({}, function(err, users) {
            return res.send({ users: users});
        });
    } else {
        return res.status(403).send('Forbidden!');
    }
});
usersRouter.get('/:id', function(req, res) {

        //user: users[req.params.id]
        User.findOne({id: req.params.id}, function (err, user) {
            if (err) {
              return res.sendStatus(500);
            } else {
              return res.send({user: user});
            }
        })
});

usersRouter.post('/', function(req, res) {
    logger.info('Inside usersRouter post route');
    logger.debug('Entering post route to determine if operation is signup or login');
    if (req.body.user.meta.operation === 'signup') {
        var user = new User({
            id: req.body.user.id,
            name: req.body.user.name,
            email: req.body.user.email,
            password: req.body.user.meta.password
        });
        user.save(function(err, newUser){
          if (err){return res.sendStatus(500);}//I think I should switch this for res.sendStatus(500);
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
        //users[user.id] = user;
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
        /*if (users[req.body.user.id]) {
        if(users[req.body.user.meta.password]) {
          res.send({
            user: users[req.body.user.id]
          });
        } else {
          res.status(404).send('Invalid password!');
        }
      } else {
        res.status(404).send('Invalid username!');
      }
    } else {
      res.status(404).send('Invalid operation!');
    }*/
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

app.use('/api/users', usersRouter);

module.exports = usersRouter;
