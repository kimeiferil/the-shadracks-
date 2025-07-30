const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        default: ''
    },
    album: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album'
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

// Add text index for searching
photoSchema.index({
    caption: 'text',
    tags: 'text'
});

module.exports = mongoose.model('Photo', photoSchema);
