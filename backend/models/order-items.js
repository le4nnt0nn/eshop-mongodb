const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    }
})

// exporta el Schema con nombre OrderItem
exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);