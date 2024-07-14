const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
    name: { type: String, require: true, unique: true },
    stock: { type: Number, require: true },
    price: {type: Number, require: true},
    imgUri: { type: String }
}, { collection: 'products' })

module.exports = mongoose.model('products', productSchema)