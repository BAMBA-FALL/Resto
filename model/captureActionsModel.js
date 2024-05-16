// cartAction.model.js

const mongoose = require('mongoose');

const cartActionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  requestBody: {
    type: Object,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const CartAction = mongoose.model('CartAction', cartActionSchema);

module.exports = CartAction;
