var express = require('express')
  , mongoose = require('../../db')
  , logoutRouter = express.Router();

logoutRouter.post('/', function(req, res) {
  req.logout();
  res.status(200).end();
});

module.exports = logoutRouter;
