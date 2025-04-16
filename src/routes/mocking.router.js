// routes/mocking.router.js
const express = require('express');
const generateMockProduct = require('../utils/generateMockProduct');
const CustomError = require('../utils/errors/CustomError');
const errors = require('../utils/errors/errorDictionary');

const router = express.Router();

router.get('/mockingproducts', (req, res) => {
  try {
    const products = Array.from({ length: 100 }, generateMockProduct);
    console.log(products[0]); 
    res.render('products', { products }); // ← renderiza a view com os produtos

  } catch (err) {
    console.error('[MockingProductError]', err.message);
    res.status(500).render('error', {
      message: 'Erro ao gerar produtos mockados',
      error: err.message
    });
  }
});

module.exports = router;