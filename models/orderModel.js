const mongoose = require('mongoose')
const { Schema } = mongoose

const orderSchema = new Schema({
    user_id: { type: String, require: true },
    prod_id: { type: String, require: true },
    count: { type: Number, require: true }
}, { collection: 'orders' })

module.exports = mongoose.model('orders', orderSchema)