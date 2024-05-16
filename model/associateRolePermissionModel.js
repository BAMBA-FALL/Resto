// associateRolePermission.js

const mongoose = require('mongoose');

const associateRolePermissionSchema = new mongoose.Schema({
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  permissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission',
    required: true
  }
});

const AssociateRolePermission = mongoose.model('AssociateRolePermission', associateRolePermissionSchema);

module.exports = AssociateRolePermission;
