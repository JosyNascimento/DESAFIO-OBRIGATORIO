//src/routes/carts.router.js
const express = require("express");
const router = express.Router();

const {
   getCartById, 
   updateQuantity, 
   removeItem,
  createCart,
  addProductToCart,
  updateCartProductQuantity,
  clearCart,
} = require("../controllers/cart.controller");

router.post("/", createCart);

router.get("/:cid", getCartById);
router.post('/update-quantity',  updateQuantity);
router.post('/remove',  removeItem);
router.post("/cid.add-product", addProductToCart);
router.put("/:cid/products/:pid", updateCartProductQuantity);
router.delete("/:cid", clearCart);

module.exports = router;
