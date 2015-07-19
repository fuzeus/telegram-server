var Mailgun = require('mailgun-js')
  , Handlebars = require('handlebars')
  , fs = require('fs')
  , config = require('../config')
  , logger = require('nlogger').logger(module);

var sendEmail = function (user, tempPassword, done) {
  //load content of template file- fs module from node, readFile function from fs
  logger.debug('Entering Mailgun email code/sendEmail function in order to create and send email');

  fs.readFile('templates/passwordReset.hbs', 'utf8', function (err, data) {
    var passwordResetSource = data;
    console.log(err, passwordResetSource);
    var passwordResetTemplate = Handlebars.compile(passwordResetSource);
    var info = { "password": tempPassword};
    var result = passwordResetTemplate(info);

    var mailgun = new Mailgun({apiKey: config.get('mailgun:apiKey'),
                              domain: config.get('mailgun:domain')});
    var info = {
      from: config.get('mailgun:fromWho'),
      to: user.email,
      subject: config.get('mailgun:subject'),
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
