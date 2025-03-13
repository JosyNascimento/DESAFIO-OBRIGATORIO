//src/routes/auth.router.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const passport = require('../config/passport.config.js');
// Middleware para disponibilizar dados do usuário nas views
router.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
});

// Autenticação com GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Rota de callback que o GitHub vai chamar após a autenticação
router.get('/api/sessions/githubcallback', passport.authenticate('github', {
    successRedirect: '/profile', // Redireciona para a página de perfil após login bem-sucedido
    failureRedirect: '/login',   // Redireciona para a página de login em caso de falha
}));


// Autenticação local (email/senha)
router.post('/register', authController.register); 
router.post('/login', authController.loginUser); 

// Falha de login
router.get("/faillogin", authController.failLogin);

// Logout
router.get('/logout', authController.logoutUser);

module.exports = router;
