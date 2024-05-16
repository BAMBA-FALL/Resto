// Fonction de validation du stock
const validateStockInput = (req, res, next) => {
    const { newStock } = req.body;
  
    // Vérification que newStock est un nombre positif
    if (typeof newStock !== 'number' || newStock < 0) {
      return res.status(400).json({ success: false, message: 'Le nouveau stock doit être un nombre positif.' });
    }
  
    next(); // Passez à la prochaine étape du middleware
  };
  
  module.exports = validateStockInput;
  