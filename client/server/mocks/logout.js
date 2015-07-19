module.exports = function(app) {
  var express = require('express');
  var logoutRouter = express.Router();

  logoutRouter.get('/', function(req, res) {
    res.send({
      'logout': []
    });
  });

  logoutRouter.post('/', function(req, res) {
    res.status(200).end();
  });

  logoutRouter.get('/:id', function(req, res) {
    res.send({
      'logout': {
        id: req.params.id
      }
    });
  });

  logoutRouter.put('/:id', function(req, res) {
    res.send({
      'logout': {
        id: req.params.id
      }
    });
  });

  logoutRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/logout', logoutRouter);
};
