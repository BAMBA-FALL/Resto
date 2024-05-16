// models/commentModel.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  annonceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Annonce',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Like',
  }],
  // Autres champs spécifiques à votre modèle de commentaire
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
