// Desafio12/src/middlewares/logger.middleware.js
const getLogger = require('../utils/logger');

const loggerMiddleware = (req, res, next) => {
  req.logger = getLogger();
  req.logger.http(`${req.method} ${req.url}`);
  next();
};

module.exports = loggerMiddleware;
