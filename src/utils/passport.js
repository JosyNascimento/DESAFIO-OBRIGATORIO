const passport = require('passport');

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function(err, user, info) {
      console.log("BBBBBBB", err, info?.message); 

      if (info?.message === "No auth token") { 
        return res.redirect("/"); 
      }

      if (err) {
        console.error("Erro de autenticação:", err); 
        return next(err); 
      }

      if (!user) {
        console.error("Usuário não encontrado:", info?.message || info); 
        return res.status(401).json({ error: info?.message || info }); 
      }

      req.user = user;
      next(); 
    })(req, res, next);
  };
};

module.exports = passportCall;