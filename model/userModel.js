const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [4, "Le nom d'utilisateur doit comporter au moins 4 caractères"]
  },
  name: {
    type: String,
    required: true,
    minlength: [4, "Le nom doit comporter au moins 4 caractères"]
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Le mot de passe doit comporter au minimum 8 caractères"]
  },
  token: {
    type: String
  },
  panier: [{
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produit'
    },
    quantite: {
      type: Number,
      default: 1
    }
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
});

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
