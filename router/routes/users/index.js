var express = require('express')
  , usersRouter = express.Router()
  , mongoose = require('../../../db')
  , logger = require('nlogger').logger(module)
  , ensureAuthenticated = require('../../../middleware/ensureAuthenticated')
  , account = require('./account')
  , graph = require('./graph')
  , User = mongoose.model('User');

usersRouter.get('/', function(req, res) {
  if (req.query.isAuthenticated) {
    account.getAuthenticatedUser(req, res);
  } else if (req.query.following) { //This is for retrieving follow lists. separate these. For req.query.follows, retrieve user matching the id and user.following
    graph.handleGetFriends(req, res);
  } else if (req.query.followers){
    graph.handleGetFollowers(req, res);
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
    account.signUp(req, res);
  } else if (req.body.user.meta.operation === 'login') {
    account.logIn(req,res);
  } else if (req.body.user.meta.operation === 'resetPassword') {
    account.resetPassword(req, res);
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
    req.user.follow(user.id, function (err) {
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
    req.user.unfollow(user.id, function (err) {
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
