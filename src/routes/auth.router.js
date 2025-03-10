const express = require("express");
const router = express.Router();
const {
  renderLoginPage,
  githubCallback,
  handleGithubCallback,
  loginUser,
  failLogin,
  logoutUser,
} = require("../controllers/auth.controller");

const passport = require("passport");


router.get('/githubcallback/success', handleGithubCallback);
router.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

router.get("/login", renderLoginPage);
router.get("/github", githubAuth);
router.get("/github", passport.authenticate("github", scope = ["user:email"]));
router.get("/githubcallback", githubCallback, handleGithubCallback);
router.post("/login", loginUser);
router.get("/faillogin", failLogin);
router.get("/logout", logoutUser);


module.exports = router;

