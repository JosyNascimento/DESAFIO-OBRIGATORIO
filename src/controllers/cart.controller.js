const Cart = require("../dao/models/cart.model");
const Product = require("../dao/models/product.model");

const createCart = async (req, res) => {
    try {
        const newCart = await Cart.create({});
        return res.status(201).json({ success: true, data: newCart });
    } catch (error) {
        console.error("Erro ao criar carrinho:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const getCartById = async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await Cart.findById(cid).populate('items.product');
        if (!cart) return res.status(404).json({ success: false, message: "Carrinho não encontrado" });

        return res.json({ success: true, data: cart });
    } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            await Cart.create({ user: userId, items: [{ product: productId, quantity: quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += parseInt(quantity);
            } else {
                cart.items.push({ product: productId, quantity: quantity });
            }
            await cart.save();
        }

        res.redirect('/cart');
    } catch (error) {
        console.error("Erro ao adicionar produto ao carrinho:", error);
        res.status(500).send('Erro ao adicionar produto ao carrinho');
    }
};

const updateCartProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ success: false, message: "Carrinho não encontrado!" });

        const itemIndex = cart.items.findIndex((item) => item.product.toString() === pid);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            res.status(200).json({ success: true, message: "Quantidade atualizada!", data: cart });
        } else {
            res.status(404).json({ success: false, message: "Produto não encontrado no carrinho!" });
        }
    } catch (error) {
        console.error("Erro ao atualizar quantidade:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = req.user;
        let cart = await Cart.findOne({ user: userId }).populate('items.product');
        const isAdminOrPremium = user && (user.role === 'admin' || user.role === 'premium');

        if (!cart) {
            return res.render('cart', { cart: null, title: 'Carrinho', user, isAdminOrPremium });
        }

        const validItems = [];
        for (const item of cart.items) {
            if (item.product) {
                const product = await Product.findById(item.product._id);
                if (product) {
                    validItems.push(item);
                }
            }
        }

        cart.items = validItems;
        await cart.save();
        res.render('cart', { cart, title: 'Carrinho', user, isAdminOrPremium });
    } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
        res.status(500).send('Erro ao buscar carrinho');
    }
};

const displayCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

        if (!cart) {
            return res.render("cart", {
                title: "Carrinho",
                cart: { items: [] },
                totalQuantity: 0,
                totalPrice: 0,
            });
        }

        const totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cart.items
            .reduce((total, item) => total + item.product.price * item.quantity, 0)
            .toFixed(2);

        res.render("cart", { title: "Carrinho", cart, totalQuantity, totalPrice });
    } catch (error) {
        console.error("Erro ao carregar o carrinho:", error);
        res.status(500).send("Erro ao carregar o carrinho.");
    }
};

const updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        await Cart.findOneAndUpdate(
            { user: userId, 'items.product': productId },
            { $set: { 'items.$.quantity': quantity } }
        );

        res.redirect('/cart');
    } catch (error) {
        console.error("Erro ao atualizar quantidade do item:", error);
        res.status(500).send('Erro ao atualizar quantidade do item');
    }
};

const removeItem = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        await Cart.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { product: productId } } }
        );

        res.redirect('/cart');
    } catch (error) {
        console.error("Erro ao remover item do carrinho:", error);
        res.status(500).send('Erro ao remover item do carrinho');
    }
};

const clearCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).json({ success: false, message: "Carrinho não encontrado!" });

        cart.items = [];
        await cart.save();

        res.status(200).json({ success: true, message: "Carrinho limpo com sucesso!" });
    } catch (error) {
        console.error("Erro ao limpar carrinho:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCart,
    getCartById,
    addProductToCart,
    updateCartProductQuantity,
    getCart,
    displayCart,
    updateQuantity,
    removeItem,
    clearCart,
};