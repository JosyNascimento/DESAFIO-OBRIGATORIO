// utils/errors/CustomError.js
class CustomError extends Error {
    constructor(name, message, cause, code) {
      super(message);
      this.name = name;
      this.cause = cause;
      this.code = code;
    }
  }
  
  module.exports = CustomError;
  