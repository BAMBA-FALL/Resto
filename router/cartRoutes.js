const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/auth');
const Cart = require('../model/cartModel');
// const captureCartActions = require('../middleware/captureCartActions');
// Route pour récupérer le panier d'un utilisateur
router.get('/cart', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du panier.', error: error.message });
  }
});

router.post('/cart', isAuthenticated, async (req, res) => {
  try {
    console.log("Début de la route d'ajout au panier");
    
    const { productId, quantity } = req.body;
    console.log("Produit ID:", productId);
    console.log("Quantité:", quantity);

    const userId = req.user.id;
    console.log("ID de l'utilisateur:", userId);

    let cart = await Cart.findOne({ userId });
    console.log("Panier trouvé:", cart);

    if (!cart) {
      console.log("Aucun panier trouvé. Création d'un nouveau panier...");
      cart = new Cart({ userId, products: [{ productId, quantity }] });
    } else {
      const existingProduct = cart.products.find(item => item.productId.toString() === productId);
      if (existingProduct) {
        console.log("Produit existant trouvé dans le panier. Mise à jour de la quantité...");
        existingProduct.quantity += quantity;
      } else {
        console.log("Nouveau produit. Ajout au panier...");
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();
    console.log("Panier sauvegardé:", cart);

    res.status(200).json({ message: 'Produit ajouté au panier avec succès.' });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit au panier:", error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du produit au panier.', error: error.message });
  }
});



// Route pour supprimer un produit du panier
router.delete('/cart/delete/:productId', isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Le panier n\'existe pas.' });
    }

    cart.products = cart.products.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: 'Produit supprimé du panier avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit du panier.', error: error.message });
  }
});



// Route pour mettre à jour la quantité d'un produit dans le panier
router.put('/cart/update/:productId', isAuthenticated,async (req, res) => {
  try {
    const { productId } = req.params;
    const { newQuantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Le panier n\'existe pas.' });
    }

    // Mettez à jour la quantité du produit dans le panier
    const existingProductIndex = cart.products.findIndex(item => item.productId.toString() === productId);
    cart.products[existingProductIndex].quantity = newQuantity;

    await cart.save();

    res.status(200).json({ message: 'Quantité du produit mise à jour dans le panier avec succès.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la quantité du produit dans le panier.', error: error.message });
  }
});


module.exports = router;
