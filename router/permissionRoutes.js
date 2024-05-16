const express = require('express');
const router = express.Router();
const Permission = require('../model/permissionModel');

// Route pour créer une nouvelle permission
// Route to create a new permission
router.post('/permissions', async (req, res) => {
  try {
    const { name, description, endpoints } = req.body;
    const permission = new Permission({ name, description, endpoints });
    await permission.save();
    res.status(201).json({ success: true, message: 'Permission created successfully', permission });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating permission', error: error.message });
  }
});
  
  
// Route pour récupérer toutes les permissions
router.get('/permissions', async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json({ success: true, permissions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des permissions', error: error.message });
  }
});

// Route pour récupérer une permission spécifique
router.get('/permissions/:permissionId', async (req, res) => {
  try {
    const { permissionId } = req.params;
    const permission = await Permission.findById(permissionId);
    if (!permission) {
      return res.status(404).json({ success: false, message: 'Permission non trouvée' });
    }
    res.status(200).json({ success: true, permission });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la permission', error: error.message });
  }
});

// Route pour mettre à jour une permission
router.put('/permissions/:permissionId', async (req, res) => {
  try {
    const { permissionId } = req.params;
    const { name, description } = req.body;
    const updatedPermission = await Permission.findByIdAndUpdate(permissionId, { name, description }, { new: true });
    if (!updatedPermission) {
      return res.status(404).json({ success: false, message: 'Permission non trouvée' });
    }
    res.status(200).json({ success: true, message: 'Permission mise à jour avec succès', permission: updatedPermission });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour de la permission', error: error.message });
  }
});

// Route pour supprimer une permission
router.delete('/permissions/:permissionId', async (req, res) => {
  try {
    const { permissionId } = req.params;
    const deletedPermission = await Permission.findByIdAndDelete(permissionId);
    if (!deletedPermission) {
      return res.status(404).json({ success: false, message: 'Permission non trouvée' });
    }
    res.status(200).json({ success: true, message: 'Permission supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression de la permission', error: error.message });
  }
});



// Route pour récupérer une permission spécifique par son nom
router.get('/permissions/byName/:permissionName', async (req, res) => {
    try {
      const { permissionName } = req.params;
      const permission = await Permission.findOne({ name: permissionName });
      if (!permission) {
        return res.status(404).json({ success: false, message: 'Permission non trouvée' });
      }
      res.status(200).json({ success: true, permission });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erreur lors de la récupération de la permission', error: error.message });
    }
  });
  




module.exports = router;
