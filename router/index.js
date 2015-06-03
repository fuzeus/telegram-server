module.exports = function (app) {
    app.use('/users', require('./routes/users'));
    app.use('/posts', require('./routes/posts'));
    app.use('/logout', require('./routes/logout'));
};
