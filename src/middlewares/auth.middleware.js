// Desafio10/src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../dao/models/user.model');


// Middleware de autorização com base no role
const authMiddleware = (role) => {
  return (req, res, next) => {
      if (!req.user) {
          return res.status(401).json({ message: "Usuário não autenticado" });
      }

      if (req.user.role !== role) {
          return res.status(403).json({ message: "Acesso negado" });
      }

      next();
  };
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
      return next();
  }
  res.status(403).json({ message: 'Acesso negado: apenas administradores' });
};

const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
      return next();
  }
  res.status(403).json({ message: 'Acesso negado: apenas usuários' });
};
const login = async (req, res, next) => {  
  console.log (req);
  try {
      const user = await User.findOne({ username: req.body.username }); 

      if (!user) {
          return res.status(400).json({ message: 'Usuário não encontrado' });
      }

      const isValid = bcrypt.compareSync(req.body.password, user.password);
      if (!isValid) {
          return res.status(400).json({ message: 'Senha inválida' });
      }

      
      // Gerar o token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'Coder', { expiresIn: '1h' });

      res.json({ message: 'Login bem-sucedido', token });
  } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

const autenticacao = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.user = decoded;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return res.status(401).json({ message: 'Autenticação falhou' });
  }
};



module.exports = { autenticacao, login, authMiddleware, isAdmin, isUser };
