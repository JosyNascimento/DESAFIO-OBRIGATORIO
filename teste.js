console.log(__dirname);
const Message = require('./dao/models/message.model'); 
console.log(Message);

const authController = require("../controllers/auth.controller.js");
console.log("Auth Controller carregado!", authController);
