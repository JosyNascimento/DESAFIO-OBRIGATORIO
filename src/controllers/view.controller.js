// src/controllers/view.controller.js
require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require('passport');
const User = require('../dao/models/user.model');

const register = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({ message: "Usuário criado com sucesso", user: newUser });
    } catch (error) {
        next(error);
    }
};

const handleGithubCallback = (req, res) => {
    req.session.user = req.user;
    res.redirect("/perfil");
};

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


const renderHomePage = (req, res) => {
    res.render('home');
};

const renderLogin = (req, res) => {
    res.render('login');
};

const renderRegister = (req, res) => {
    res.render('register');
};

const renderProducts = (req, res) => {
    res.render('products');
};

const renderCarts = (req, res) => {
    res.render('cart');
};

const renderProfile = (req, res) => {
    res.render('profile');
};

const renderchat = (req, res) => {
    res.render('chat');
};

module.exports = {
    register,
    handleGithubCallback,
    failLogin,
    logoutUser,
    renderHomePage,
    renderLogin,
    renderRegister,
    renderProducts,
    renderCarts,
    renderProfile,
    renderchat
};