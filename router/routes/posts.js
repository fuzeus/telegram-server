var express = require('express');
var app = express();
var postsRouter = express.Router();
var mongoose = require('../db');
var logger = require('nlogger').logger(module);


postsRouter.get('/', function(req, res) {
    //var postsArray = Object.keys(posts).map(function(id) {
      //  return posts[id];
    if (req.query.author) {
        Post.find({ author : req.query.author }, function (err, posts){
            if (err) {
                return res.sendStatus(500);
            } else {
                return res.send({'posts': posts});
            }
        })
    } else {
        Post.find({}, function (err, posts) {
            if (err) {
                return res.sendStatus(500);
            } else {
                return res.send({posts: posts});
            }
        });
    }
        /*var postsByAuthor = postsArray.filter(function(post) {
            return post.author === req.query.author;
        });
        return res.send({
            "posts": postsByAuthor
        });
    } else {
        return res.send({
            "posts": postsArray
        });
    }*/
});

var ensureAuthenticated = require('../middleware/ensureAuthenticated')


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
        Post.findOne({ _id : req.params.postid }, function(err, post) {
                    if (err) {
                      res.sendStatus(500);
                    }
                    else {
                      return res.send({post: post});
                    }
        });//query Post model by _id

});

postsRouter.delete('/:postid', function(req, res) {
    Post.findByIdAndRemove(req.params.postid, function(err, post) {
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

module.exports = postsRouter;
