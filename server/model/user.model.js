const { model } = require('../service/mongoose');
const mongoose = require('../service/mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);