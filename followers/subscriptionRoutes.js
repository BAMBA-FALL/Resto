// subscriptionRoutes.js
const express = require('express');
const isAuthenticated = require('../middleware/auth');
const userModel = require('../model/userModel');
const router = express.Router();

// Route pour suivre un utilisateur
router.post('/follow/:userId', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    const followerId = req.user.id;

    // Ajoutez la logique pour suivre l'utilisateur dans la base de données
    const userToFollow = await userModel.findById(userId);

    if (!userToFollow) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Ajoutez le follower à la liste des followers de l'utilisateur suivi
    userToFollow.followers.push(followerId);
    await userToFollow.save();

    return res.status(200).json({ message: 'Vous suivez maintenant cet utilisateur.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors du suivi de l\'utilisateur.', error: error.message });
  }
});

// Route pour récupérer les abonnements d'un utilisateur
router.get('/followers/:userId', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;

    // Récupérez les abonnements de l'utilisateur dans la base de données
    const user = await userModel.findById(userId).populate('followers', 'username');

    return res.status(200).json({ followers: user.followers });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des abonnements.', error: error.message });
  }
});

module.exports = router;
