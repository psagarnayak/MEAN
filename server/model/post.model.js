const mongoose = require('../service/mongoose');
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true
    }
});

module.exports = mongoose.model('Post', postSchema);


