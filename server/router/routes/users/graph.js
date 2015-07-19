var mongoose = require('../../../db')
  , User = mongoose.model('User');

exports.handleGetFollowers = function (req, res) {
  User.find({following: req.query.followers}, function (err, users) {
    if (err) {
      return res.sendStatus(500);
    }
    var clientUsers = users.map(function(user){
      return user.toClient(req.user);
    })
    return res.send({ users: clientUsers});
  });
}

exports.handleGetFriends = function (req, res) {
  User.findOne({id: req.query.following}, function (err, user) {
    if (err) {
      return res.sendStatus(500);
    }
    User.find({id: {$in: user.following}}, function (err, users) {
      if (err) {
        return res.sendStatus(500);
      }
      var clientUsers = users.map(function(user){
        return user.toClient(req.user);
      });
      return res.send({ users: clientUsers});
    })
  });
}
