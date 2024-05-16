const express = require('express');
const router = express.Router();
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY'); 
const auth = require('../middleware/auth');
const Product = require('../model/productModel');
const Order = require('../model/orderModel');
const Cart = require('../model/cartModel');

// Finaliser la commande (paiement)
router.post('/checkout', auth, async (req, res) => {
    try {
        const user = req.user;
        const cart = await Cart.findOne({ userId: user._id });
    
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }
    
        // Vérifier et mettre à jour le stock des produits
        for (const item of cart.items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ error: `Product ${item.productId} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Not enough stock for product ${product._id}` });
            }
            product.stock -= item.quantity; // Mettre à jour le stock du produit
            await product.save();
        }
    
        // Calculer le total de la commande
        const totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
        // Créer un paiement avec Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalPrice * 100, // en centimes
            currency: 'eur',
            customer: user.stripeCustomerId, // identifiant client Stripe
            setup_future_usage: 'off_session',
        });
    
        // Attendre la confirmation du paiement avec Stripe
        if (paymentIntent.status !== 'succeeded') {
            // Si le paiement échoue, mettre à jour le statut de la commande et réinitialiser le stock des produits
            cart.status = 'Paiement échoué';
            await cart.save();
            for (const item of cart.items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stock += item.quantity; 
                    await product.save();
                }
            }
            return res.status(400).json({ error: 'Payment failed' });
        }
    
        // Créer une nouvelle commande
        const order = new Order({
            userId: user._id,
            items: cart.items,
            totalAmount: totalPrice,
            paymentStatus: 'Paid', // Mettre à jour le statut de paiement de la commande
        });
        await order.save();
    
        // Mettre à jour le statut de la commande dans la base de données
        cart.status = 'En cours de traitement';
        await cart.save();
    
        // Vider le panier après la commande
        cart.items = [];
        await cart.save();
    
        res.json({ success: true, orderId: order._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
