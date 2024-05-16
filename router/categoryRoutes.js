const express = require('express');
const router = express.Router();
const Category = require('../model/categoryModel'); 
const Product = require('../model/productModel')
// Créer une nouvelle catégorie
router.post('/categories', async (req, res) => {
    try {
      const { name, parentCategory } = req.body;
  
      const newCategory = new Category({
        name,
        parentCategory: parentCategory || null,
      });
  
      const savedCategory = await newCategory.save(); 
      res.status(201).json(savedCategory); 
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la création de la catégorie." });
    }
  });
  

// Obtenir toutes les catégories principales
router.get('/categories', async (req, res) => {
    try {
      const categories = await Category.find({ parentCategory: null }); 
      res.status(200).json(categories); 
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des catégories." }); 
    }
  });
  
// Récupérer une catégorie par son ID
router.get('/categories/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);
        
        if (!category) {
            return res.status(404).json({ message: 'La catégorie n\'existe pas.' });
        }

        res.status(200).json({ category });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la catégorie par ID.', error: error.message });
    }
});


// Obtenir les sous-catégories associées à une catégorie principale
router.get('/categories/:parentCategoryId/subcategories', async (req, res) => {
    try {
      const { parentCategoryId } = req.params;
      const subCategories = await Category.find({ parentCategory: parentCategoryId });
  
      if (subCategories.length === 0) {
        return res.status(404).json({ error: "Aucune sous-catégorie trouvée." });
      }
  
      res.status(200).json(subCategories);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des sous-catégories." });
    }
  });
  

// Mettre à jour une catégorie par ID
router.put('/categories/:id', async (req, res) => {
    try {
      const { name, parentCategory } = req.body;
  
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        {
          name,
          parentCategory: parentCategory || null,
        },
        { new: true } 
      );
  
      if (!updatedCategory) {
        return res.status(404).json({ error: "Catégorie non trouvée." });
      }
  
      res.status(200).json(updatedCategory); 
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la catégorie." });
    }
  });
  
// Supprimer une catégorie par ID
router.delete('/categories/:id', async (req, res) => {
    try {
      const deletedCategory = await Category.findByIdAndDelete(req.params.id); 
      if (!deletedCategory) {
        return res.status(404).json({ error: "Catégorie non trouvée." });
      }
  
      res.status(200).json({ message: "Catégorie supprimée avec succès." }); 
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression de la catégorie." });
    }
  });
  

// Récupérer des produits par catégorie
router.get('/categories/:categoryId/products', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.find({ categorie: categoryId });

        if (products.length === 0) {
            return res.status(404).json({ message: 'Aucun produit trouvé pour cette catégorie.' });
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits par catégorie.', error: error.message });
    }
});



module.exports = router;
