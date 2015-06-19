var express = require('express')
  , app = express()
  , postsRouter = express.Router()
  , mongoose = require('../../../db')
  , stream = require('./stream')
  , logger = require('nlogger').logger(module)
  , Post = mongoose.model('Post')
  , ensureAuthenticated = require('../../../middleware/ensureAuthenticated');
  
postsRouter.get('/', function(req, res) {
  if (req.query.author) {
    stream.handleProfilePostsRequest(req,res);
  } else {
    stream.handleDashboardPostsRequest(req,res);
  }
});

postsRouter.post('/', ensureAuthenticated, function(req, res) {
  if( req.user.id === req.body.post.author) {
    Post.create(req.body.post, function(err, newPost) {
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
  Post.findOne({ _id : req.params.postid }, function(err, post) {
    if (err) {
      res.sendStatus(500);
    } else {
      return res.send({post: post});
    }
  });
});

postsRouter.delete('/:postid', function(req, res) {
  Post.findByIdAndRemove(req.params.postid, function(err, post) {
    if (err) {
      return res.sendStatus(500);
    } else {
      return res.sendStatus(204);
    }
  })
});

module.exports = postsRouter;
