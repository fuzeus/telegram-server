var express = require('express');
var app = express();
// Route implementation
//put serialize, deserialize, localStrategy
var logger = require('nlogger').logger(module);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.serializeUser(function(user, done) {
    logger.info('Inside serializeUser in order to provide unique info for the cookie');
    logger.debug('Entering serializeUser with the following arguments, user, done');
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    logger.info('Inside deserializeUser in order to extract unique info from the cookie');
    logger.debug('Entering deserializeUser with the following arguments, id, done');
    var user = User.findOne({id: id}, function(err, user) {
      if (err) {
        return done(err);
      }
      return done(null, user);
    });
});

//verify function below: line 20
passport.use(new LocalStrategy({
        usernameField: 'user[id]',
        passwordField: 'user[meta][password]'
    },
    function(id, password, done) {
        logger.debug('Entering the verify function with the following arguments, username, password');
        User.findOne({ id: id }, function(err, user) {
        //var user = users[id];
            if (!user) {
                return done(null, false, {
                    message: 'Incorrect username.'
                });
            }
            if (user.password !== password) {
                return done(null, false, {
                  message: 'Incorrect password.'
                });
            }
            return done(null, user);
        });
    }
));
// when done() is called it is actually calling function(err, user, info) from below and implementing that callback



var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'Why choose Ember over Angular? Because it is on fire!',
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

//add cookieParser, session, passport, from middleware section of passport.

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/telegram');

var usersRouter = express.Router();

var userSchema = mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String,
    photo: String,
    followedByAuthenticatedUser: Boolean
});

var User = mongoose.model('User', userSchema);

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

var allUsersArray = Object.keys(users).map(function(key) {
    return users[key];
});
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
        return res.send({
            users: allUsersArray
        });
    } else {
        return res.status(403).send('Forbidden!');
    }
});
usersRouter.get('/:id', function(req, res) {
    res.send({
        //user: users[req.params.id]
        user: User.findOne({id: req.params.id}, function (err, user) {
            if (err) {
              return res.sendStatus(500);
            } else {
              return user;
            }
        })
    });
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


var postsRouter = express.Router();
/*
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
};*/

var postSchema = mongoose.Schema({
    author: String,//ref to user? population? relationships?,
    body: String,
    repost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    createdDate: Date
});

var Post = mongoose.model('Post', postSchema);

postsRouter.get('/', function(req, res) {
    //var postsArray = Object.keys(posts).map(function(id) {
      //  return posts[id];
    var postsArray = Post.find( function (err, posts) {
        if (err) {
            return res.sendStatus(500);
        } else {
            return posts;
        }
    });

    if (req.query.author) {
        var postsByAuthor = Post.find ({ author : req.query.author }, function (err, posts){
            if (err) {
                return res.sendStatus(500);
            } else {
                return posts;
            }
        })
        /*var postsByAuthor = postsArray.filter(function(post) {
            return post.author === req.query.author;
        });*/
        return res.send({
            "posts": postsByAuthor
        });
    } else {
        return res.send({
            "posts": postsArray
        });
    }
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.sendStatus(403);
  }
}

postsRouter.post('/', ensureAuthenticated, function(req, res) {
  if( req.user.id === req.body.post.author) {
    //currentPostId++;
    var post = new Post ({
        author: req.body.post.author,
        body: req.body.post.body,
        createdDate: req.body.post.createdDate,
        repost: req.body.post.repost
    });
    //posts[currentPostId] = post;//insert save with callback
    post.save(function(err, newPost) {
        if (err) {
            return res.sendStatus(500);
        } else {
            res.send({
                "post": newPost
            });
        }
    })
  } else {
        return res.sendStatus(403);
  }
});

postsRouter.get('/:postid', function(req, res) {
    res.send({
        'post': Post.findOne({ _id : req.params.postid }, function(err, post) {
                    if (err) {
                      res.sendStatus(500);
                    }
                    else {
                      return post;
                    }
        })//query Post model by _id
    });
});

postsRouter.delete('/:postid', function(req, res) {
    Post.remove({ _id : req.params.postid }, function(err, post) {
        if (err) {
            return res.sendStatus(500);
        }
        else {
            return res.sendStatus(204);
        }
    })
//query that removes the object, similar to get post route
});

app.use('/api/posts', postsRouter);

var logoutRouter = express.Router();

logoutRouter.post('/', function(req, res) {
  req.logout();

  res.status(200).end();
});

app.use('/api/logout', logoutRouter);
