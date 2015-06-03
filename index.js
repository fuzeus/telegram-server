var express = require('express');
var app = express();

require('./middleware')(app);

require('./router')(app);

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});

module.exports = app;
