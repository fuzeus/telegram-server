var express = require('express');
var app = express();
var postsRouter = express.Router();
var mongoose = require('../../db');
var logger = require('nlogger').logger(module);

var Post = mongoose.model('Post');

postsRouter.get('/', function(req, res) {
  if (req.query.author) {
    Post.find({ author : req.query.author }, function (err, posts){
      if (err) {
        return res.sendStatus(500);
      } else {
        return res.send({'posts': posts});
      }
    });
  } else {
    var authors = req.user.following;
    authors.push(req.user.id);
    Post.find({ author: {$in: authors}}, function (err, posts) {
      if (err) {
        return res.sendStatus(500);
      } else {
        return res.send({posts: posts});
      }
    });
  }
});

var ensureAuthenticated = require('../../middleware/ensureAuthenticated')

postsRouter.post('/', ensureAuthenticated, function(req, res) {
  if( req.user.id === req.body.post.author) {
    var post = new Post ({
      author: req.body.post.author,
      body: req.body.post.body,
      createdDate: req.body.post.createdDate,
      repost: req.body.post.repost
    });
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
