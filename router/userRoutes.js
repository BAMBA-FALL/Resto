const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult, check } = require('express-validator');
const isAuthenticated = require('../middleware/auth');
const subscriptionRoutes = require('../router/subscriptionRoutes');
const userModel = require('../model/userModel');
const router = express.Router();

// Middleware global pour gérer les erreurs
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
});

// Route pour l'enregistrement d'un nouvel utilisateur
router.post('/register',
[
  check('username').notEmpty().trim().escape(),
  check('name').notEmpty().trim().escape(),
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Les mots de passe ne correspondent pas.');
    }
    return true;
  })
],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { username, name, email, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Les mots de passe ne correspondent pas.' });
      }

      const userExists = await userModel.findOne({ email: email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'Un utilisateur existe déjà avec cet email.' });
      }
      const hashedPassword = await bcrypt.hash(password,10);

      const newUser = await userModel.create({
        username: username,
        name: name,
        email: email,
        password: hashedPassword
      });

      const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE });

      res.status(201).json({ success: true, message: 'Utilisateur enregistré avec succès.', token });
    } catch (error) {
      handleError(res, error);
    }
  }
);


// Route pour la connexion d'un utilisateur existant
router.post('/login',
  [
    check('email').isEmail().normalizeEmail(),
    check('password').notEmpty().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      const userExist = await userModel.findOne({ email });
      if (!userExist) {
        return res.status(400).json({ success: false, message: 'Informations d\'identification incorrectes.' });
      }

      const isPasswordMatched = await bcrypt.compare(password, userExist.password);
      if (!isPasswordMatched) {
        return res.status(400).json({ success: false, message: 'Informations d\'identification incorrectes.' });
      }

      const token = jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE });

      // Rediriger vers une page par défaut pour tous les utilisateurs
      return res.json({
        success: true,
        message: 'Connecté avec succès',
        access_token: token,
        redirect: '/default' // Changez cette valeur pour rediriger vers la page souhaitée pour tous les utilisateurs
      });
    } catch (error) {
      handleError(res, error);
    }
  }
);




router.post('/logout', isAuthenticated, async (req, res) => {
  try {
    const { _id } = req.user;

    // Suppression du token de la base de données
    await userModel.findByIdAndUpdate(_id, { $unset: { token: 1 } });

    // Suppression du cookie JWT
    res.clearCookie('token'); // Utilisation de res.clearCookie()

    res.send('Déconnexion réussie');
  } catch (error) {
    console.error('Erreur lors de la déconnexion', error);
    res.status(500).send('Erreur lors de la déconnexion');
  }
});




// Ajouter une route pour récupérer la liste de tous les utilisateurs
router.get('/users', isAuthenticated, async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 }); // Exclure le champ du mot de passe

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'Aucun utilisateur trouvé.' });
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    handleError(res, error);
  }
});

// Route pour récupérer un utilisateur par ID
router.get('/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await userModel.findById(userId, { password: 0 }); // Exclure le champ du mot de passe

    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    handleError(res, error);
  }
});



// Obtenez les informations de l'utilisateur connecté
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur à partir du token JWT
    const userId = req.user.id;

    // Rechercher l'utilisateur dans la base de données
    const user = await userModel.findById(userId).select('-password');

    // Si l'utilisateur n'est pas trouvé, renvoyer une erreur
    if (!user) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    // Renvoyer les informations de l'utilisateur
    res.status(200).json({ success: true, user });
  } catch (error) {
    // Gérer les erreurs
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
  }
});

// Mettre à jour les informations de l'utilisateur connecté
router.put('/me', isAuthenticated, async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur à partir du token JWT
    const userId = req.user.id;

    // Récupérer les nouvelles informations de l'utilisateur à partir du corps de la requête
    const { username, name, email } = req.body;

    // Mettre à jour l'utilisateur dans la base de données
    const updatedUser = await userModel.findByIdAndUpdate(userId, { username, name, email }, { new: true });

    // Si l'utilisateur n'est pas trouvé, renvoyer une erreur
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    // Renvoyer les informations de l'utilisateur mis à jour
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    // Gérer les erreurs
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur interne du serveur.' });
  }
});


//Mis à jour de l'utilisateur
router.put('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Vérifiez si l'utilisateur qui fait la demande est un administrateur
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Mettez à jour le rôle de l'utilisateur avec l'ID spécifié
    const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });

    res.status(200).json({ message: 'Rôle de l\'utilisateur mis à jour avec succès', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du rôle de l\'utilisateur', error: error.message });
  }
});


//La suppression de l'utilisateur par son Id
router.delete('/users/:userId', async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.userId);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ success: true, message: 'Compte utilisateur supprimé avec succès' });
  } catch (error) {
    handleError(res, error);
  }
});


// Route pour compter le nombre total d'utilisateurs
router.get('/users/count', async (req, res) => {
  try {
    const count = await userModel.countDocuments();
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors du comptage des utilisateurs', error: error.message });
  }
});



module.exports = router;


//LES ROUTES POUR GÉRER LES ABONNEMENTS DES UTILISATEURS
router.use("/subscription", subscriptionRoutes);

// Fonction pour gérer les erreurs de manière centralisée
function handleError(res, error) {
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: 'Erreur de validation.', errors: validationErrors });
  } else if (error.name === 'MongoError' && error.code === 11000) {
    return res.status(400).json({ success: false, message: 'Un utilisateur existe déjà avec cet email.' });
  } else {
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur.', error: error.message });
  }
}




