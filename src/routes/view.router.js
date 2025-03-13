//src/routes/view.router.js
const express = require('express');
const userController = require('../controllers/user.controller'); 

const router = express.Router();
const {
  renderHomePage,
  renderLogin,
  renderRegister,
  renderProducts,
  renderCarts,
  renderProfile,
  renderchat
} = require('../controllers/view.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.get('/', renderHomePage);
router.get('/login', renderLogin);
router.get('/register', renderRegister);
router.get('/realtimeproducts', renderProducts)
router.get('/chat', renderchat)
router.get('/products',  renderProducts);
router.get('/cart', authMiddleware, renderCarts); // Aplica o middleware de autenticação
router.get('/profile', authMiddleware, renderProfile); // Aplica o middleware de autenticação
router.get('/register-success', (req, res) => {
  res.render('registerSuccess', { title: 'Registro concluído' });
});

module.exports = router;