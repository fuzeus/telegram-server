var Mailgun = require('mailgun-js');
var Handlebars = require('handlebars');
var fs = require('fs');
var logger = require('nlogger').logger(module);

var sendEmail = function (user, tempPassword, done) {
  //load content of template file- fs module from node, readFile function from fs
  logger.debug('Entering Mailgun email code/sendEmail function in order to create and send email');

  fs.readFile('templates/passwordReset.hbs', 'utf8', function (err, data) {
    var passwordResetSource = data;
    console.log(err, passwordResetSource);
    var passwordResetTemplate = Handlebars.compile(passwordResetSource);
    var info = { "password": tempPassword};
    var result = passwordResetTemplate(info);

    var api_key = 'key-19a22b34e17857fb9f4ac91c39855bc8';
    var domain = 'sandbox98739a374cb44e1ebef812d5f1dc7e9d.mailgun.org';
    var from_who = 'tristan@fuzeus.com';

    var mailgun = new Mailgun({apiKey: api_key, domain: domain});
    var info = {
      from: from_who,
      to: user.email,
      subject: 'Password Reset from Telegram',
      html: result
    }
    logger.debug(info);

    mailgun.messages().send(info, function (err, body) {
      if (err) {
        logger.error(err);
      }
      logger.debug('Sending Email');

      console.log(body);
      done(err);
    })
  })
}

module.exports = sendEmail;
