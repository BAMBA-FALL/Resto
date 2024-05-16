const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'returned'],
    default: 'pending',
  },
  totalPrice: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.statics.updateOrderStatus = function(orderId, newStatus) {
  return this.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });
};

orderSchema.statics.countOrdersByStatus = function(
) {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        totalOrders: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: '$_id',
        totalOrders: 1,
      },
    },
  ]);
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
