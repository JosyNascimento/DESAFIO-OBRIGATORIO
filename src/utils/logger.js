const winston = require('winston');

const customLevels = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
  colors: {
    debug: 'blue',
    http: 'cyan',
    info: 'green',
    warning: 'yellow',
    error: 'red',
    fatal: 'magenta',
  },
};

winston.addColors(customLevels.colors);

const devLogger = winston.createLogger({
  levels: customLevels.levels,
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: 'errors.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

const getLogger = () => {
  return process.env.NODE_ENV === 'production' ? prodLogger : devLogger;
};

module.exports = getLogger;
