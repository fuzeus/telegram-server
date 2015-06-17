var passport = require('./auth');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongostore')(session);

module.exports = function (app){
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(session({
    secret: 'Why choose Ember over Angular? Because it is on fire!',
    resave: false,
    saveUninitialized:false,
    store: new MongoStore({'db': 'sessions'})
  }));
  app.use(passport.initialize());
  app.use(passport.session());
};
