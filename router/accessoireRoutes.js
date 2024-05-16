const express = require('express');
const router = express.Router();
const Accessory = require('../model/accessoireModel');
const isAuthenticated = require('../middleware/auth');
const upload = require('../multer/multerConfig');

// Route POST pour créer un accessoire
router.post('/accessories', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, stock, productId } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !description || !price || !category || !productId || !image) {
      return res.status(400).json({ message: "Des champs obligatoires sont manquants." });
    }

    const newAccessory = new Accessory({
      title,
      description,
      price,
      category,
      stock: stock || 0,
      productId,
      image,
    });

    await newAccessory.save(); // Sauvegarder l'accessoire
    res.status(201).json({ message: "Accessoire créé avec succès.", accessory: newAccessory });
  } catch (error) {
    console.error("Erreur lors de la création de l'accessoire:", error);
    res.status(500).json({ message: "Erreur lors de la création de l'accessoire.", error: error.message });
  }
});
// Route pour récupérer tous les accessoires
router.get('/accessories', async (req, res) => {
  try {
    const accessories = await Accessory.find(); // Obtenir tous les accessoires
    res.status(200).json(accessories);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des accessoires.", error: error.message });
  }
});

// Route pour récupérer les accessoires associés à un produit
router.get('/products/:id/accessories', async (req, res) => {
  try {
    const { id } = req.params; // ID du produit
    const accessories = await Accessory.find({ productId: id }); // Récupérer les accessoires associés

    if (accessories.length === 0) {
      return res.status(404).json({ message: "Aucun accessoire associé trouvé." });
    }

    res.status(200).json(accessories); // Retourner la liste des accessoires
  } catch (error) {
    console.error("Erreur lors de la récupération des accessoires associés:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des accessoires associés.", error: error.message });
  }
});


// Route pour mettre à jour un accessoire par son ID
router.put('/accessories/:id', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, stock, productId } = req.body;
    const image = req.file ? req.file.filename : null;

    // Mise à jour de l'accessoire
    const updatedAccessory = await Accessory.findByIdAndUpdate(id, {
      title,
      description,
      price,
      category,
      stock,
      productId,
      image,
    }, { new: true }); // Retourne le document mis à jour
    
    if (!updatedAccessory) {
      return res.status(404).json({ message: 'Accessoire non trouvé.' });
    }

    res.status(200).json({ message: 'Accessoire mis à jour avec succès.', accessory: updatedAccessory });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'accessoire:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'accessoire.", error: error.message });
  }
});

// Route pour supprimer un accessoire par son ID
router.delete('/accessories/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAccessory = await Accessory.findByIdAndDelete(id);

    if (!deletedAccessory) {
      return res.status(404).json({ message: 'Accessoire non trouvé.' });
    }

    res.status(200).json({ message: 'Accessoire supprimé avec succès.' });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'accessoire:", error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'accessoire.", error: error.message });
  }
});

module.exports = router;
