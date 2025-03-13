//src/controllers/session.controller.js
const passport = require('../config/passport.config.js');
const jwt = require('jsonwebtoken');


// Renderiza a página de login
const renderLoginPage = (req, res) => {
    res.render('login');
};

const githubAuth = passport.authenticate('github');

const githubCallback = passport.authenticate('githubCallback', {
    failureRedirect: '/login',
    successRedirect: '/perfil'
});

const login = (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: "Usuário ou senha inválidos" });

        req.logIn(user, (err) => {
            if (err) return next(err);

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({
                message: "Login bem-sucedido",
                token,
                user: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                },
            });
        });
    })(req, res, next);
};

const loginUser = async (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/faillogin');

        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        };

        res.redirect('/perfil');
    })(req, res, next);
};

const failLogin = (req, res) => {
    console.log("Falha no login - usuário ou senha inválidos");
    res.redirect('/login?message=Usuário ou senha inválidos');
};

const logoutUser = async (req, res) => {
    await req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};

module.exports = {
    login,
    renderLoginPage,
    githubAuth,
    githubCallback,
    loginUser,
    failLogin,
    logoutUser
};