var nconf = require('nconf')
  , path = require('path')
  , logger = require('nlogger').logger(module);

if (process.env.NODE_ENV === 'prod') {
  logger.info('loaded config-prod.json');
  nconf.file(path.join(__dirname, 'config-prod.json'));
} else {
  logger.info('loaded config-dev.json');
  nconf.file(path.join(__dirname, 'config-dev.json'));
}
module.exports = nconf;
