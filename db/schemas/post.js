var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
    author: String,//ref to user? population? relationships?,
    body: String,
    repost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    createdDate: Date
});

module.exports = postSchema
