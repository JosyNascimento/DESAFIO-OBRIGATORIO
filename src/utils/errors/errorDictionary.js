// utils/errors/errorDictionary.js
module.exports = {
    PRODUCT_CREATION_ERROR: {
      code: 1001,
      message: 'Erro ao criar o produto. Verifique os dados enviados.',
    },
    PRODUCT_NOT_FOUND: {
      code: 1002,
      message: 'Produto não encontrado.',
    },
    CART_NOT_FOUND: {
      code: 2001,
      message: 'Carrinho não encontrado.',
    },
    PRODUCT_OUT_OF_STOCK: {
      code: 2002,
      message: 'Produto sem estoque suficiente.',
    },
    INVALID_PRODUCT_ID: {
      code: 2003,
      message: 'ID de produto inválido.',
    },
    UNAUTHORIZED_ACTION: {
      code: 3001,
      message: 'Ação não autorizada.',
    }
  };
  