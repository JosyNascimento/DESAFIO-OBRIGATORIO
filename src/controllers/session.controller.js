//src/controllers/session.controller.js

const User = require("../dao/models/user.model");
const bcrypt = require("bcrypt");
const passport = require("passport");
require("../config/passport.config"); 
const jwt = require("jsonwebtoken");

// Renderiza a página de login
const renderLoginPage = (req, res) => {
  res.render("login");
};

const githubAuth = passport.authenticate("github", { scope: ["user:email"] });

const githubCallback = (req, res, next) => {
  passport.authenticate("github", async (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.redirect("/login?message=Erro ao autenticar com GitHub");

    req.logIn(user, (err) => {
      if (err) return next(err);

      const token = jwt.sign(
        { id: user._id, role: user.role || "admin" }, // TODO: remover esse padrão admin depois
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, { httpOnly: true, secure: false });
      res.redirect("/perfil"); // Redireciona para a página de perfil

      console.log("user vindo do github callback\n", user);
      return res.json({
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

const login = (req, res, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: "Usuário ou senha inválidos" });

    req.login(user, (err) => {
      if (err) return next(err);

      // Gerar o token JWT
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log("Token gerado:", token);
      console.log("req.user após login:", req.user);

      res.cookie("token", token, { httpOnly: true, secure: false });
      return res.redirect("/perfil");
    });
  })(req, res, next);
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Usuário não encontrado" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Senha incorreta" });
  }

  // Gera o token JWT
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    "SEU_SECRET_KEY",
    { expiresIn: "1h" }
  );
  return res.json({ message: "Login bem-sucedido", token });
  // Define o token como um cookie HTTP para ser usado na sessão do navegador

  res.cookie("token", token, { httpOnly: true, secure: false }); // Altere `secure: true` para produção (https)

  // Redireciona para a página de perfil
  res.redirect("/perfil");
};

const failLogin = (req, res) => {
  console.log("Falha no login - usuário ou senha inválidos");
  res.redirect("/login?message=Usuário ou senha inválidos");
};

const logoutUser = async (req, res) => {
  await req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

module.exports = {
  login,
  renderLoginPage,
  githubAuth,
  githubCallback,
  loginUser,
  failLogin,
  logoutUser,
};
