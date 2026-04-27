const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    currentLength: {
        type: Number,
        default: 0
    },
    maxCapacity: {
        type: Number,
        required: true
    },
    serviceRate: {
        type: Number,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    isPaused: {
        type: Boolean,
        default: false
    },
    history: [
        {
            timestamp: Date,
            length: Number,
            waitTime: Number
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Queue', queueSchema);