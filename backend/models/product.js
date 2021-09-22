const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: Number
})

// exporta el Schema con nombre Product
exports.Product = mongoose.model('Product', productSchema);