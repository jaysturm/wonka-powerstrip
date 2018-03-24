var winston = require('winston');
var logger;

logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: `${__basedir}/wonka-powerstrip.log` })
    ]
  }
);

module.exports = logger;