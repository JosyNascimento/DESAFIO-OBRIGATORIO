const jwt = require("jsonwebtoken");

const PRIVATE_KEY = process.env.JWT_SECRET || "coder"; // Usar variável de ambiente para produção

const generateToken = (user) => {
  // Adicionar informações específicas ao token, como ID do usuário
  const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, PRIVATE_KEY, { expiresIn: '1h' });
  return token;
};

// Middleware de autenticação
const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send({ error: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  jwt.verify(token, PRIVATE_KEY, (err, credentials) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ error: "Not authorized" });
    }

    console.log("Credentials:", credentials); // Log para verificação das credenciais
    req.user = credentials; // Armazena as credenciais no objeto req
    next(); // Passa o controle para o próximo middleware ou rota
  });
};

module.exports = {
  generateToken,
  authToken,
};
