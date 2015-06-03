var express = require('express');
var app = express();
// Route implementation
//put serialize, deserialize, localStrategy
var logger = require('nlogger').logger(module);
var passport = require('./middleware/auth');


var setUpMiddleware = require('./middleware');
setUpMiddleware(app);
//still require bodyParser etc?
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');


//add cookieParser, session, passport, from middleware section of passport.

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

var mongoose = require('./db');

var User = mongoose.model('User');
/*
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
});*/

app.use('/api/users', usersRouter);

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

var Post = mongoose.model('Post');


app.use('/api/posts', postsRouter);

app.use('/api/logout', logoutRouter);

var router = require('./router')(app);

// Error Handling
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
});

module.exports = app;
