module.exports = function(app) {
  var express = require('express');
  var usersRouter = express.Router();

  var users = {
    'joeschmidt': {
      id: 'joeschmidt',
      name: 'Joe Schmidt',
      email: 'joeschmidt@schmidt.com',
      photo: "assets/images/avatar-yellow.png",
      followedByAuthenticatedUser: true
    },
    'carollovell': {
      id: 'carollovell',
      name: 'Carol Lovell',
      email: 'carol@lovelegos.com',
      photo: "assets/images/avatar-red.png",
      followedByAuthenticatedUser: true
    },
    'krysrutledge': {
      id: 'krysrutledge',
      name: 'Krys Rutledge',
      email: 'krys@hulkitup.com',
      photo: "assets/images/avatar-turquoise.png",
      followedByAuthenticatedUser: true
    }
  };

  var allUsersArray = Object.keys(users).map(function(key) { return users[key]; });
  usersRouter.get('/', function(req, res) {
  if (req.query.isAuthenticated) {
    // if you want to always be logged in
    res.send({
      users: [users['joeschmidt']]
    });

    // if you don't want to be logged in
    //res.send({users: []});
  } else if (req.query.followedBy || req.query.follows) {
    return res.send({
      users: allUsersArray
    });
  } else {
    return res.status(403).send('Forbidden!');
  }
});
  usersRouter.get('/:id', function(req, res) {
    res.send({
      user: users[req.params.id]
    });
  });

  usersRouter.post('/', function(req, res) {
    if (req.body.user.meta.operation === 'signup') {
      var user = {
        id: req.body.user.id,
        name: req.body.user.name,
        email: req.body.user.email
      };
      res.send({
        user: user
      });
    } else if (req.body.user.meta.operation === 'login') {
      if (users[req.body.user.id]) {
        res.send({
          user: users[req.body.user.id]
        });
      } else {
        res.status(404).send('Invalid username/password!');
        }
    } else {
      res.status(404).send('Invalid operation!');
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
};
