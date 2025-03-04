//passport.config.js

const passport = require('passport');
const local = require('passport-local');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../dao/models/user.model');
const bcrypt = require('bcrypt');  // Importando bcrypt
const { createHash } = require('../utils/password');  // Supondo que esta função cria o hash da senha

const localStrategy = local.Strategy;

// Função utilitária para buscar usuário
const findUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    throw new Error(`Erro ao buscar usuário: ${error.message}`);
  }
};

// Função utilitária para verificar a senha
const isValidPassword = (password, userPassword) => {
  return bcrypt.compareSync(password, userPassword);
};

const initializePassport = () => {
  passport.use('register', new localStrategy({
    passReqToCallback: true, usernameField: 'email', passwordField: 'password'
  }, async (req, username, password, done) => {
    const { first_name, last_name, email } = req.body;
    try {
      let user = await User.findOne({ email: username });
      if (user) {
        console.log("User already exists");
        return done(null, false, { message: 'E-mail já registrado' });
      }

      const newUser = new User({ first_name, last_name, email, password: createHash(password) });

      let result = await newUser.save();
      return done(null, result);
    } catch (error) {
      console.error(`Erro ao registrar usuário: ${error}`);
      return done(null, false, { message: 'Erro interno ao registrar o usuário' });
    }
  }));


  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/githubcallback",
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("GitHub Profile:", profile);  // Verifica os dados retornados
        console.log("Access Token:", accessToken); // Verifica o token recebido

        let email = null;

        // Verifica se o perfil já contém emails
        if (profile.emails && profile.emails.length > 0) {
            email = profile.emails[0].value;
        } else {
            // Busca manualmente os emails, caso não tenham sido enviados no perfil
            console.log("Tentando buscar email manualmente...");
            const emailResponse = await axios.get('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            console.log("Resposta dos emails:", emailResponse.data);

            const primaryEmail = emailResponse.data.find(e => e.primary && e.verified);
            if (primaryEmail) {
                email = primaryEmail.email;
            }
        }

        console.log("Email do usuário:", email);

        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
            user = await User.create({
                githubId: profile.id,
                name: profile.displayName || profile.username,
                email: email || null, // Evita erro caso não tenha email
                password: null
            });
        }

        return done(null, user);
    } catch (error) {
        console.error("Erro ao autenticar com GitHub:", error.response ? error.response.data : error.message);
        return done(error);
    }
}));
  passport.use('login', new localStrategy({ usernameField: 'email', passwordField: 'password' }, async (username, password, done) => {
    try {
      let user = await User.findOne({ email: username });
      if (!user) {
        console.log("User not found");
        return done(null, false, { message: 'Usuário não encontrado' });
      }

      // Verifique a senha
      if (!isValidPassword(password, user.password)) {
        return done(null, false, { message: 'Senha incorreta' });
      }
      return done(null, user);
    } catch (error) {
      return done(`Erro ao autenticar usuário: ${error}`);
    }
  }));

  passport.use('reset-password', new localStrategy({ usernameField: 'email', passwordField: 'password'}, async (username, password, done) => {
    try {
      const userFound = await User.findOne({ email: username });
      if (!userFound) {
        console.log("User not found");
        return done(null, false, { message: 'Usuário não encontrado' });
      }

      const newPass = createHash(password);
      await User.updateOne({ email: username }, { password: newPass });
      return done(null, userFound);
    } catch (error) {
      return done(null, false, { message: `Erro ao alterar a senha: ${error}` });
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(`Erro ao buscar usuário: ${error}`);
    }
  });
};

module.exports = initializePassport;
