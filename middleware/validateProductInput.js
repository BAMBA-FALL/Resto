const { body, check, validationResult } = require('express-validator');
const upload = require('../multer/multerConfig');
const validateProductInput = [
  upload.array('images', 4), // Traitement des images avec Multer
  body('title').trim().notEmpty().withMessage('Le titre est requis'),
  body('description').trim().notEmpty().withMessage('La description est requise'),
  body('userId').trim().notEmpty().withMessage('L\'ID utilisateur est requis'),
  body('price').isNumeric().withMessage('Le prix doit être numérique'),
  body('type').trim().notEmpty().withMessage('Le type est requis'),
  body('categorie').trim().notEmpty().withMessage('La catégorie est requise'),
  body('stock').isInt().withMessage('Le stock doit être un nombre entier positif'),
  body('color').trim().notEmpty().withMessage('La couleur est requise'),
  body('storageCapacity').isInt().withMessage('La capacité de stockage doit être un nombre entier'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


module.exports = validateProductInput;
