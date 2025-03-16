// src/routes/user.router.js
const express = require("express");
const userController = require("../controllers/user.controller");
const { autenticacao, isAdmin } = require("../middlewares/auth.middleware");
const passport = require("passport");
console.log('user.router.js carregado');
const authMiddleware = require('../middlewares/auth.middleware').authMiddleware;

const router = express.Router();

// Rotas protegidas
router.get('/perfil', authMiddleware, (req, res) => {
    if (!req.user) {
        return res.redirect('/login'); // Caso o usuário não esteja autenticado
    }
    res.render('perfil', { user: req.user }); // Passando os dados do usuário para a view
});

  

// Debug: Verifica se o `userController` foi importado corretamente
console.log("userController:", userController);

// Rotas para registro de usuário
router.get("/register", userController.renderRegisterPage);
router.post("/register", userController.registerUser);


// Lista de usuários - Apenas administradores podem acessar
router.get("/userList", autenticacao, isAdmin, userController.renderUserList);

// Rotas para redefinição de senha
router.get("/reset-password", userController.renderResetPasswordPage);
router.get("/fail-reset-password", userController.failResetPassword);
router.post(
  "/reset-password",
  passport.authenticate("reset-password", {
    failureRedirect: "/fail-reset-password",
    failureMessage: true,
  }),
  userController.resetPassword
);

// Apenas administradores podem visualizar essa lista
router.get("/list", autenticacao, isAdmin,authMiddleware, userController.renderUserList);

module.exports = router;
