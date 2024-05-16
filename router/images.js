// routes/images.js
const express = require('express');
const router = express.Router();
const upload = require('../multer/multerConfig'); // Mettez le chemin correct

router.post('/upload', upload.single('image'), (req, res) => {
  // Récupérez le chemin du fichier ou l'URL de l'image et stockez-le dans le modèle
  const imagePath = req.file.path;
  // Enregistrez l'image dans le modèle ou faites d'autres opérations nécessaires
  // ...
  res.json({ message: 'Image téléchargée avec succès' });
});

module.exports = router;
