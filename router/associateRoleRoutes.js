const express = require('express');
const router = express.Router();
const AssociateRolePermission = require('../model/associateRolePermissionModel');

router.post('/associateRouteRole', async (req, res) => {
  try {
    const { roleName, routeName } = req.body;
    
    const result = await AssociateRolePermission.associateRouteToRole(roleName, routeName);

    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }

    res.status(201).json({ success: true, message: 'Route associée avec succès au rôle', role: result.role });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de l\'association de la route au rôle', error: error.message });
  }
});

module.exports = router;
