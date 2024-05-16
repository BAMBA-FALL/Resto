// permission.model.js
const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  endpoints: [{ type: String }]
});

module.exports = mongoose.model('Permission', permissionSchema);


// const mongoose = require('mongoose');

// const permissionSchema = new mongoose.Schema({
//     name: String,
//     description: String,
//     endpoints: [String]
// });

// module.exports = mongoose.model('Permission', permissionSchema);

