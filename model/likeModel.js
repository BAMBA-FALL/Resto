// models/likeModel.js
const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  annonceId: {  // Modifiez cette ligne
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  // Vous pouvez ajouter d'autres champs si nécessaire, par exemple, pour distinguer les likes sur les commentaires, etc.
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
