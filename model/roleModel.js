// role.model.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Role', roleSchema);


// const mongoose = require('mongoose');

// const roleSchema = new mongoose.Schema({
//     roleName: String,
//     permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }]
// });

// module.exports = mongoose.model('Role', roleSchema);

