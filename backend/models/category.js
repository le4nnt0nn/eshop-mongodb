const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
 
})

// exporta el Schema con nombre Category
exports.Category = mongoose.model('Category', categorySchema);