// Desafio10/src/middlewares/auth.middleware.js

console.log("auth.middleware.js carregado");

const jwt = require('jsonwebtoken'); // Importa a biblioteca jsonwebtoken para lidar com tokens JWT
const User = require('../dao/models/user.model'); // Importa o modelo User do banco de dados
const bcrypt = require('bcrypt'); // Importa a biblioteca bcrypt para comparar senhas criptografadas

// Middleware para garantir que o usuário esteja autenticado
const authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login'); // Redireciona para o login caso não autenticado
};




// Middleware para verificar se o usuário é um administrador
const isAdmin = (req, res, next) => {
  // Verifica se o usuário está autenticado e tem o role "admin"
  if (req.user && req.user.role === 'admin') {
      return next();
  }
  res.status(403).json({ message: 'Acesso negado: apenas administradores' });
};

// Middleware para verificar se o usuário é um usuário comum
const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
      return next();
  }
  console.log("Acesso negado: apenas usuários");
  res.status(403).json({ message: 'Acesso negado: apenas usuários' });
};
// Middleware para realizar o login do usuário
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
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'SEU_SECRET_KEY', { expiresIn: '1h' });

  // Configura o cookie com o token
  res.cookie('token', token, { httpOnly: true, secure: false }); // Altere secure para true em produção

  console.log('Token configurado no cookie:', token); // Adicione um log para garantir que o token está sendo configurado

};

// Middleware para autenticar o usuário usando token JWT
const autenticacao = (req, res, next) => {
  const token = req.cookies.token;  // Verifique o cookie aqui, caso esteja usando cookie para armazenar o token

  if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
      const decoded = jwt.verify(token, 'SEU_SECRET_KEY'); // Substitua pelo seu segredo real
      req.user = decoded;  // Armazena os dados do usuário no request
      next();  // Passa para a próxima função
  } catch (error) {
      return res.status(403).json({ message: "Token inválido" });
  }
};



module.exports = { autenticacao, loginUser, authMiddleware, isAdmin, isUser };
