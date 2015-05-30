var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
      var kittySchema = mongoose.Schema({
        name: String
      })
      kittySchema.methods.speak = function() {
        var greeting = this.name
          ? "Meow name is " + this.name
          : "I don't have a name"
        console.log(greeting);
      }

      var Kitten = mongoose.model('Kitten', kittySchema);

      var silence = new Kitten({ name: 'Silence'});
      console.log(silence.name);
      var fluffy = new Kitten({ name: 'fluffy' });
      fluffy.speak();

      fluffy.save(function(err, fluffy) {
        if (err) { return console.error(err);};
        fluffy.speak();
      });

      Kitten.find(function (err, kittens) {
        if (err) { return console.error(err);};
        console.log(kittens);
      });

      Kitten.find({ name: /^Fluff/}, callback)
});

//user Schema
var userSchema = mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  photo: String,
  followedByAuthenticatedUser: Boolean
});

var User = mongoose.model('User', userSchema);

var postSchema = mongoose.Schema({
  author: String//ref to user? population? relationships?,
  body: String,
  repost: { type: Schema.Types.ObjectId, ref: 'Post' },
  createdDate: Date
});

var Post = mongoose.model('Post', postSchema);
