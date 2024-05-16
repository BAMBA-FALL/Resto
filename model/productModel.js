const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0  
  },
  color: {
    type: String,
    required: true,
  },
  colors: [{
    type: String,
    required: true,
  }],
  storageCapacity: [{
    type: Number,
    required: true,
  }],
  images: [{
    type: String,
    required : true,
  }],

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
