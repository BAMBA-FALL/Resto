const express = require('express');
const router = express.Router();
const Role = require('../model/roleModel');
const Permission = require('../model/permissionModel')
const UserRole  = require('../model/userRoleModel')
const isAuthenticated = require('../middleware/auth')

// Route to create a new role
router.post('/roles', async (req, res) => {
  try {
    const { name} = req.body;
    const existRole = await Role.findOne({ name });
    if (existRole) {
      return res.status(400).json({ success: false, message: 'Un rôle avec ce nom existe déjà' });
    }
    const role = new Role({ name});
    await role.save();
    return res.status(201).json({ success: true, message: 'Rôle créé avec succès', role });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Erreur lors de la création du rôle', error: error.message });
  }
});


// Route to assign permissions to a role
router.post('/assignPermissionsToRole', async (req, res) => {
  try {
    const { name, permissionNames } = req.body; // Changer de roleName à name
    // const role = await Role.findOne({name}); 
    // if (!role) {
    //   return res.status(404).json({ success: false, message: 'Role not found' });
    // }
    const permissions = await Permission.find({ name: { $in: permissionNames } });
    if (!permissions || permissions.length !== permissionNames.length) {
      return res.status(404).json({ success: false, message: 'Some permissions not found' });
    }
    role.permissions = permissions.map(permission => permission._id);
    await role.save();
    res.status(200).json({ success: true, message: 'Permissions assigned to role successfully', role });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error assigning permissions to role', error: error.message });
  }
});



// Route pour récupérer tous les rôles
router.get('/roles', async (req, res) => {
  try {
    // Récupérer tous les rôles depuis la base de données
    const roles = await Role.find();

    // Répondre avec un statut 200 et la liste des rôles
    res.status(200).json({ success: true, roles });
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des rôles', error: error.message });
  }
});

// Route pour supprimer un rôle par son ID
router.delete('/roles/:roleId',isAuthenticated, async (req, res) => {
  try {
    // Récupérer l'ID du rôle à supprimer depuis les paramètres de l'URL
    const { roleId } = req.params;

    // Supprimer le rôle de la base de données par son ID
    const deletedRole = await Role.findByIdAndDelete(roleId);
    if (!deletedRole) {
      return res.status(404).json({ success: false, message: 'Rôle non trouvé' });
    }

    // Répondre avec un statut 200 et un message de succès
    res.status(200).json({ success: true, message: 'Rôle supprimé avec succès' });
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression du rôle', error: error.message });
  }
});

// Route pour mettre à jour un rôle par son ID
router.put('/roles/:roleId',isAuthenticated, async (req, res) => {
  try {
    // Récupérer l'ID du rôle à mettre à jour et les nouvelles informations du corps de la requête
    const { roleId } = req.params;
    const { roleName } = req.body;

    // Mettre à jour le rôle dans la base de données par son ID
    const updatedRole = await Role.findByIdAndUpdate(roleId, { roleName }, { new: true });
    if (!updatedRole) {
      return res.status(404).json({ success: false, message: 'Rôle non trouvé' });
    }

    // Répondre avec un statut 200 et le rôle mis à jour
    res.status(200).json({ success: true, message: 'Rôle mis à jour avec succès', role: updatedRole });
  } catch (error) {
    // Gérer les erreurs
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du rôle', error: error.message });
  }
});


// Route pour récupérer un rôle par son nom
router.get('/roles/byName/:roleName',isAuthenticated, async (req, res) => {
  try {
    const { roleName } = req.params;
    const role = await Role.findOne({ roleName });
    if (!role) {
      return res.status(404).json({ success: false, message: 'Rôle non trouvé' });
    }
    res.status(200).json({ success: true, role });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération du rôle', error: error.message });
  }
});

// Autres routes...



router.post('/userrole',isAuthenticated, async (req, res) => {
  try {
    const { username, name, email, password,poste, roleName } = req.body;

    const role = await Role.findOne({ roleName });
    if (!role) {
      return res.status(400).json({ success: false, message: 'Le rôle spécifié n\'existe pas' });
    }
    const newUser = new UserRole({ 
      username, 
      name, 
      email, 
      password, 
      poste,
      roleName
    });

    // Validez les données par rapport au schéma de Mongoose
    const validationError = newUser.validateSync();
    if (validationError) {
      return res.status(400).json({ success: false, message: 'Données invalides', error: validationError });
    }

    // Enregistrez le nouvel utilisateur dans la base de données
    await newUser.save();

    res.status(201).json({ success: true, message: 'Utilisateur créé avec succès', user: newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
  }
});


module.exports = router;
