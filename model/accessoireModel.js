const mongoose = require('mongoose');

const accessorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0  
  },
  category: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
    required: true,
  },
  image:{
    type: String,
    required: true,
  }
});

const Accessory = mongoose.model('Accessory', accessorySchema);

module.exports = Accessory;
