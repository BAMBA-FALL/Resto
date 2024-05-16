const express = require('express');
const router = express.Router();
const Carousel = require('../model/carouselModel');
const isAuthenticated = require('../middleware/auth');
const upload = require('../multer/multerConfig');

// Route POST pour télécharger un carousel
router.post('/carousels', isAuthenticated, upload.array('images',4), async (req, res) => {
    try {
      const user = req.user.id; 
      const { title, description } = req.body;

      // Créer un nouveau carousel en associant l'ID de l'utilisateur
      const newCarousel = new Carousel({
        images: req.files.map(file => file.filename),
        user: user,
        title: title,
        description: description
      });
  
      // Enregistrer le carousel dans la base de données
      await newCarousel.save();
  
      res.status(201).json({ message: 'Carousel créé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la création du carousel :', error);
      res.status(500).json({ message: 'Erreur lors de la création du carousel' });
    }
});



// Route GET pour récupérer tous les carousels
router.get('/carousels', async (req, res) => {
  try {
      // Récupérer tous les carousels depuis la base de données
      const carousels = await Carousel.find();
      res.status(200).json({ carousels });
  } catch (error) {
      console.error('Erreur lors de la récupération des carousels :', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des carousels' });
  }
});



module.exports = router;
