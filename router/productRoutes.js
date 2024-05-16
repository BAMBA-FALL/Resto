const express = require('express');
const router = express.Router();
const Product = require('../model/productModel');
const upload = require('../multer/multerConfig');
const isAuthenticated = require('../middleware/auth')
const Accessories = require('../model/accessoireModel')

router.post('/products', isAuthenticated, upload.array('images', 4), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      stock,
      color,
      colors,
      storageCapacity,
    } = req.body;

    const userId = req.user.id;

    const newProduct = new Product({
      title,
      description,
      userId,
      price,
      category,
      stock: stock || 0,
      color: color || '',
      colors: (colors || '').split(',').map(c => c.trim()),
      storageCapacity: (storageCapacity || '').split(',').map(c => parseInt(c.trim()) || 0),
      images: req.files.map(file => file.filename),
    });

    await newProduct.save(); // Sauvegarder le produit
    res.status(200).json({ message: 'Produit ajouté avec succès.', product: newProduct });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error);
    res.status(500).json({ message: "Erreur lors de l'ajout du produit.", error });
  }
});
// Ajouter un produit avec gestion du stock
// router.post('/products', isAuthenticated, upload.array('images', 4), async (req, res) => {
//   try {
//     const { title, description, price, type, category, stock, variations } = req.body;
//     const userId = req.user.id;


//     const newProducts = [];


//     for (const variation of variations) {

//       const { color, capacities } = variation;
//       for (const capacityInfo of capacities) {
   
//         const { storageCapacity, images } = capacityInfo;

//         const newProduct = new productModel({
//           title: title,
//           description: description,
//           userId: userId,
//           price: price,
//           type: type,
//           category: category,
//           stock: stock,
//           color: color,
//           colors: [color], 
//           storageCapacity: storageCapacity,
//           images: images
//         });
//         newProducts.push(newProduct);
//       }
//     }
//     await productModel.insertMany(newProducts);

//     return res.status(200).json({ message: 'Produits ajoutés avec succès.' });
//   } catch (error) {
//     return res.status(500).json({ message: 'Erreur lors de l\'ajout des produits.', error: error.message });
//   }
// });



// Récupérer tous les produits
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().populate('userId', 'username');
    return res.status(200).json({ products }); 
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des produits.', error: error.message });
  }
});

// Récupérer un produit par son ID
router.get('/products/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Le produit n\'existe pas.' });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du produit par ID.', error: error.message });
  }
});

// Modifier un produit avec gestion du stock
router.put('/products/:productId', isAuthenticated, upload.array('images'), async (req, res) => {
  try {
    const { productId } = req.params;
    const { title, description, price, type, stock, color, storageCapacity } = req.body;

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Le produit n\'existe pas.' });
    }

    if (existingProduct.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Vous n\'avez pas les autorisations pour modifier ce produit.' });
    }

    existingProduct.title = title || existingProduct.title;
    existingProduct.description = description || existingProduct.description;
    existingProduct.price = price || existingProduct.price;
    existingProduct.type = type || existingProduct.type;
    existingProduct.stock = stock || existingProduct.stock; 
    existingProduct.color = color || existingProduct.color; 
    existingProduct.storageCapacity = storageCapacity || existingProduct.storageCapacity; 

    if (req.file) {
      existingProduct.images = req.file.filename;
    }

    await existingProduct.save();

    return res.status(200).json({ message: 'Le produit a été modifié avec succès.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la modification du produit.', error: error.message });
  }
});

// Supprimer un produit
router.delete('/products/:productId', isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.params;
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Le produit n\'existe pas.' });
    }

    if (existingProduct.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Vous n\'avez pas les autorisations pour supprimer ce produit.' });
    }

    await existingProduct.remove();

    return res.status(200).json({ message: 'Le produit a été supprimé avec succès.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la suppression du produit.', error: error.message });
  }
});


// Route pour mettre à jour les accessoires d'un produit
router.put('/products/:id/accessories', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params; // ID du produit
    const { accessories } = req.body; // Liste des IDs d'accessoires

    // Validation des IDs d'accessoires
    if (!accessories || !Array.isArray(accessories)) {
      return res.status(400).json({ message: "Les accessoires doivent être une liste d'IDs valides." });
    }

    // Mettre à jour le produit avec la liste des accessoires
    const updatedProduct = await Product.findByIdAndUpdate(id, { accessories }, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Produit non trouvé." });
    }

    res.status(200).json({ message: "Accessoires mis à jour avec succès.", product: updatedProduct });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des accessoires du produit:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour des accessoires du produit.", error: error.message });
  }
});


// Route de recherche pour les produits
router.get('/search', async (req, res) => {
  try {
      const { query } = req.query; // Obtenir le texte de recherche
      if (!query) {
          return res.status(400).json({ error: "Aucun terme de recherche fourni." });
      }

      const products = await Product.find({
          $or: [
              { title: new RegExp(query, 'i') }, // Recherche par titre
              { description: new RegExp(query, 'i') } // Recherche par description
          ]
      });

      res.status(200).json({ products }); // Renvoyer les produits trouvés
  } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      res.status(500).json({ error: "Erreur interne du serveur." });
  }
});


module.exports = router;