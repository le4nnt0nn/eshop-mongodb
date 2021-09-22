const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
 
})

// exporta el Schema con nombre Order
exports.Order = mongoose.model('Order', orderSchema);