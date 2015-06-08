var Handlebars = require('handlebars');

var sendEmail = function (user, tempPassword, done) {
  //load content of template file- fs module from node, readFile function from fs
  fs.readFile('../templates/passwordreset', function (err, data) {
    var passwordResetSource = data;
    var passwordResetTemplate = Handlebars.compile(passwordResetSource);
    var info = { "password": tempPassword};
    var result = passwordResetTemplate(info);
  })
}

module.exports = sendEmail;
