var express = require('express');
var logoutRouter = express.Router();
var mongoose = require('../../db');

logoutRouter.post('/', function(req, res) {
  req.logout();
  res.status(200).end();
});

module.exports = logoutRouter;
