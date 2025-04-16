// utils/errors/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(`[${err.name}] ${err.message}`);
    res.status(500).json({
      status: 'error',
      name: err.name,
      message: err.message,
      code: err.code || 'UNHANDLED_ERROR',
      cause: err.cause || 'Não especificado'
    });
  };
  
  module.exports = errorHandler;
  