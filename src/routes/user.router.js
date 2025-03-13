// Desafio10-ReestruturaçãodoServidor/src/routes/user.router.js
const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

  router.post('/registro', userController.registerUser);
  router.post('/register', userController.registerUser);
  router.get('/perfil', userController.getUserProfile);
  router.get('/reset-password', userController.renderResetPasswordPage);
  router.get('/fail-reset-password', userController.failResetPassword);
  router.post('/reset-password', userController.resetPassword);
  router.get('/list', userController.listUsers);

module.exports = router;