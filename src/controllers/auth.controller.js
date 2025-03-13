require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require('../dao/models/user.model');
const passport = require('../config/passport.config.js');
const bcrypt = require('bcryptjs');
const renderLoginPage = (req, res) => {
    res.render("login");
};

const githubCallback = passport.authenticate("githubCallback", { // Correção aqui
    failureRedirect: "/login",
    successRedirect: "/perfil",
});

const handleGithubCallback = (req, res) => {
    try {
        req.session.user = req.user;
        res.redirect("/perfil");
    } catch (error) {
        console.error("Erro no callback do GitHub:", error);
        res.redirect("/faillogin");
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.redirect('Registro bem-sucedido');
    } catch (error) {
        res.status(500).send('Erro ao registrar usuário');
    }
};

const loginUser = (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: "Usuário ou senha inválidos" });

        req.logIn(user, (err) => {
            if (err) return next(err);

            const token = jwt.sign(
                { id: req.user._id, role: req.user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            console.log("Token gerado:", token);

            res.json({
                message: "Login bem-sucedido",
                token: token,
                user: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                },
            });
        });
    })(req, res, next);
};
function autenticacao(req, res, next){
    if( req.session && req.session.user){
        return next();
    }
        res.redirect('/login');
    }
const failLogin = (req, res) => {
    res.status(401).json({ message: "Usuário ou senha inválidos" });
};

const logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if (!err) {
            res.redirect("/login");
        } else {
            res.status(500).json({ message: "Erro no logout", error: err });
        }
    });
};

// Exportando o controlador
const authController = {
    renderLoginPage,
    register,
    githubCallback,
    handleGithubCallback,
    loginUser,
    failLogin,
    logoutUser,
};

// Logs para depuração

console.log("Register:", typeof authController.register);
console.log("Login:", typeof authController.loginUser);
console.log("Handle Github Callback:", typeof authController.handleGithubCallback);
console.log("Fail Login:", typeof authController.failLogin);
console.log("Logout:", typeof authController.logoutUser);

module.exports = authController;