const mongoose = require('mongoose');
const { Schema } = mongoose


// schema have a "default" to allows developer set default value
const userSchema = new Schema({
    username: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    role: { type: String, default: 'user', require: true },
    isApprove: { type: Boolean, default: false, require: true },
}, { collection: 'users' })

module.exports = mongoose.model('users', userSchema)