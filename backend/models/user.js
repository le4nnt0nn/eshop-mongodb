const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: Number
})

// exporta el Schema con nombre User
exports.User = mongoose.model('User', userSchema);