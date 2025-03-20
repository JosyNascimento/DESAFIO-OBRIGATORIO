//src/routes/auth.router.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const passport = require('../config/passport.config');
// Middleware para disponibilizar dados do usuário nas views
router.use((req, res, next) => {
    if (req.session.user) {
        res.locals.user = req.session.user;
    }
    next();
});

router.get('/githubcallback/success', authController.handleGithubCallback);
// Autenticação com GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubCallback', passport.authenticate('github', {
    failureRedirect: '/login',
    successRedirect: '/perfil'
}));

// Autenticação local (email/senha)
router.post('/register', authController.register); 
router.post('/login', authController.loginUser); 

// Falha de login
router.get("/faillogin", authController.failLogin);

// Logout
router.get('/logout', authController.logoutUser);

module.exports = router;
