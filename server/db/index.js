var mongoose = require('mongoose')
  , config = require('../config')
  , userSchema = require('./schemas/user')
  , postSchema = require('./schemas/post');

mongoose.connect('mongodb://' + config.get('database:host') + '/' + config.get('database:name'));
mongoose.model('User', userSchema);
mongoose.model('Post', postSchema);

module.exports = mongoose;
