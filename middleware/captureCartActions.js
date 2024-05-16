// Middleware pour capturer les actions du panier
const CartAction = require('../model/captureActionsModel');
const captureCartActions = (req, res, next) => {
    try {
      const userId = req.user.id; // Supposons que vous ayez déjà un middleware pour extraire l'ID de l'utilisateur à partir du jeton JWT
      const { method, path, body } = req;
  

      const cartAction = {
        userId,
        method,
        path,
        requestBody: body,
        timestamp: new Date()
      };
  
    
  
      next();
    } catch (error) {
      console.error('Erreur lors de la capture des actions du panier:', error);
      return res.status(500).json({ message: 'Erreur lors de la capture des actions du panier.', error: error.message });
    }
  };
  
  module.exports = captureCartActions;
  