const User = require('../dao/models/user.model'); // Importa o modelo de usuário
const { createHash } = require('../utils/password'); // Importa a função para criar hashes de senha


/**
 * Registra um novo usuário.
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 */


// Adicione a função registerUser aqui:
const registerUser = async (req, res) => {
    try {
        // Extrai os dados do corpo da requisição
        const { first_name, last_name, email, password, role, avatar } = req.body;

        // Verifica se já existe um usuário com o mesmo email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'E-mail já cadastrado' });
        }

        // Cria o hash da senha
        const hashedPassword = createHash(password);

        // Cria um novo usuário no banco de dados
        const newUser = await User.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: role || "user", // Define o papel como "user" se não for fornecido
            avatar: avatar || "public/img/sandra.jpg", // Define um avatar padrão se não for fornecido
        });

        // Retorna uma resposta de sucesso com o novo usuário
        return res.status(201).json({ message: "Usuário cadastrado com sucesso", user: newUser });
    } catch (error) {
        // Loga o erro e retorna uma resposta de erro interno do servidor
        console.error("Erro ao registrar usuário:", error);
        return res.status(500).json({ message: "Erro no servidor", error: error.message });
    }
};


const renderPerfilPage = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Usuário não autenticado" });
    }
    // Obtém os dados do usuário da sessão
    const { first_name, last_name, email, age } = req.user;
    // Renderiza a página de perfil com os dados do usuário
    res.render('perfil', { first_name, last_name, email, age });
};

const getUserProfile = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    console.log("Usuário logado:", req.session.user);

    const user = req.session.user?.provider === 'github' 
        ? { 
            username: req.session.user.username,
            email: req.session.user.email,
            profileUrl: req.session.user.profileUrl,
        } 
        : { 
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            email: req.session.user.email,
        };

    res.render('perfil', { ...user });
};

const renderResetPasswordPage = (req, res) => {
    res.render('reset-password'); // Renderiza a página de redefinição de senha
};


const failResetPassword = (req, res) => {
    // Obtém as mensagens da sessão ou define um array vazio
    const messages = req.session.messages || [];
    // Limpa as mensagens da sessão
    req.session.messages = [];
    // Obtém a primeira mensagem de erro ou define uma mensagem padrão
    const errorMessage = messages.length > 0 ? messages[0] : "Erro ao resetar password";
    // Envia a mensagem de erro como resposta
    res.send(`Erro ao resetar password: ${errorMessage}`);
};

const resetPassword = async (req, res) => {
    return res.redirect('/login?message=Senha redefinida com sucesso');
};

// Exemplo no userController.js
const renderUserList = async (req, res) => {
    try {
        const users = await User.find();
        const usersOwnProperties = users.map(user => Object.assign({}, user.toObject())); // or {...user.toObject()}
        const isAdmin = req.user && req.user.role === 'admin';
        res.render('userList', { users: usersOwnProperties, isAdmin });
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(500).send("Erro interno no servidor");
    }


const renderPerfilPage = async (req, res) => {
    const user = Object.assign({}, req.session.user);
    res.render('perfil', user);
}
};
const renderRegisterPage = (req, res) => {
    res.render('register');  // Renderiza a página de registro
};

module.exports = {
    renderRegisterPage, // Renderiza a página de registro de usuário
    renderUserList,
    renderPerfilPage,
    registerUser,
    failResetPassword,
    renderResetPasswordPage,
    resetPassword,
    getUserProfile,
    renderPerfilPage,
};
