
var express = require('express');
var app = express();
// Route implementation
//put serialize, deserialize, localStrategy
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  var user = users[id];
    done(err, user);
});

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
//verify function below: line 20
passport.use(new LocalStrategy({
  usernameField: 'user[id]',
  passwordField: 'user[meta][password]'
},
  function(id, password, done) {
    var user = users[id];
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    }
));
// when done() is called it is actually calling function(err, user, info) from below and implementing that callback



var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({ secret: 'Why choose Ember over Angular? Because it is on fire!'}));
app.use(passport.initialize());
app.use(passport.session());

 //add cookieParser, session, passport, from middleware section of passport.

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

  var usersRouter = express.Router();

  var users = {
    'joeschmidt': {
      id: 'joeschmidt',
      name: 'Joe Schmidt',
      email: 'joeschmidt@schmidt.com',
      password: '123456',
      photo: "assets/images/avatar-yellow.png",
      followedByAuthenticatedUser: true
    },
    'carollovell': {
      id: 'carollovell',
      name: 'Carol Lovell',
      email: 'carol@lovelegos.com',
      password: '123456',
      photo: "assets/images/avatar-red.png",
      followedByAuthenticatedUser: true
    },
    'krysrutledge': {
      id: 'krysrutledge',
      name: 'Krys Rutledge',
      email: 'krys@hulkitup.com',
      password: '123456',
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
        email: req.body.user.email,
        password: req.body.user.meta.password
      };
      users[user.id] = user;
      res.send({
        user: user
      });
    } else if (req.body.user.meta.operation === 'login') {
      passport.authenticate('local', function(err, user, info) {
        if (err) { return res.sendStatus(500); }
        if (!user) { return res.sendStatus(404); }
        req.logIn(user, function(err) {
          if (err) { return res.sendStatus(500); }
          res.send({user: user});
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


  var postsRouter = express.Router();

  var currentPostId = 4;

  var posts = {
    "p1": {
      id: "p1",
      author: "joeschmidt",
      body: "Post 1 body",
      createdDate: new Date(2014, 10, 10)
    },
    "p2": {
      id: "p2",
      author: "carollovell",
      body: "Post 2 body",
      createdDate: new Date(2014, 10, 12)
    },
    "p3": {
      id: "p3",
      author: "krysrutledge",
      body: "Post 3 body",
      createdDate: new Date()
    },
    "p4": {
      id: "p4",
      author: "krysrutledge",
      body: "Post 1 body",
      repost: "p1",
      createdDate: new Date()
    }
  };

  postsRouter.get('/', function(req, res) {
    var postsArray = Object.keys(posts).map(function(id) {
      return posts[id];
    });

    if (req.query.author) {
      var postsByAuthor = postsArray.filter(function(post) {
        return post.author === req.query.author;
      });
      return res.send({
        "posts": postsByAuthor
      });
    } else {
      return res.send({
        "posts": postsArray
      });
    }
  });

  postsRouter.post('/', function(req, res) {
    currentPostId++;
    var post = {
      id: currentPostId,
      author: req.body.post.author,
      body: req.body.post.body,
      createdDate: req.body.post.createdDate,
      repost: req.body.post.repost
    };
    posts[currentPostId] = post;
    res.send({
      "post": post
    });
  });

  postsRouter.get('/:id', function(req, res) {
    res.send({
      'post': posts[req.params.id]
    });
  });

  postsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/posts', postsRouter);
