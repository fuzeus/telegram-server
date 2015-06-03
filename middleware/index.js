//import here relative path for passport
var passport = require('./auth');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

module.exports = function (app){
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(session({
      secret: 'Why choose Ember over Angular? Because it is on fire!',
      resave: false,
      saveUninitialized:false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  //put rest of middlewares here. Don't forget to import them
}
