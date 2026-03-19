const mongoose = require('mongoose');

const QueueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, default: '' },
    currentLength: { type: Number, default: 0 },
    serviceRate: { type: Number, default: 5 },
    maxCapacity: { type: Number, default: 50 },
    numCounters: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    isPaused: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    history: [
    {
        length: Number,
        timestamp: { type: Date, default: Date.now }
    }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Queue', QueueSchema);  