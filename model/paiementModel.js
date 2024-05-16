// models/Payment.js

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({

  userId: 
  { type: mongoose.Schema.Types.ObjectId, 
  ref: 'User',
  required: true },
  amount: {
    type: Number, 
    required: true },

  currency: 
  { type: String, 
  default: 'eur' },
  paymentMethodId:{
    type: String, 
    required: true },

  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' },

  created_at: { 
    type: Date, 
    default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);