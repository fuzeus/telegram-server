var passport = require('./auth')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , MongoStore = require('connect-mongostore')(session);

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
