module.exports = function(app) {
  var express = require('express');
  var postsRouter = express.Router();

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
  };

  postsRouter.get('/', function(req, res) {
    var postsArray = Object.keys(posts).map(function(id) {
      return posts[id];
    });

    if (req.query.author) {
      var postsByAuthor = postsArray.filter(function(post) {
        return post.author === req.query.author;
      });
      return res.send({
        "posts": postsByAuthor
      });
    } else {
      return res.send({
        "posts": postsArray
      });
    }
  });

  postsRouter.post('/', function(req, res) {
    currentPostId++;
    var post = {
      id: currentPostId,
      author: req.body.post.author,
      body: req.body.post.body,
      createdDate: req.body.post.createdDate,
      repost: req.body.post.repost
    };
    posts[currentPostId] = post;
    res.send({
      "post": post
    });
  });

  postsRouter.get('/:id', function(req, res) {
    res.send({
      'post': posts[req.params.id]
    });
  });

  postsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api/posts', postsRouter);
};
