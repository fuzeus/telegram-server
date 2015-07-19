var mongoose = require('../../../db');
var Post = mongoose.model('Post');

exports.handleProfilePostsRequest = function(req, res) {
  Post.find({ author : req.query.author }, function (err, posts){
    if (err) {
      return res.sendStatus(500);
    } else {
      return res.send({'posts': posts});
    }
  });
}

exports.handleDashboardPostsRequest = function(req, res) {
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
