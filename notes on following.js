user
//findOne({id: req.query.following}, function (err, user) {
    User.find({id: {$in: user.following}}, function( err, users) {
      users.map(function(user) {
        return user.toClient(req.user);
}
})
})

}




User.find({following: req.user.followedBy}, function (err, users) {
  users.map(function(user) {
    return user.toClient(req.user);
})
})
