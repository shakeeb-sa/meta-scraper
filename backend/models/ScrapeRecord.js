const mongoose = require('mongoose');

const scrapeRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    title: String,
    description: String,
    ogImage: String,
    favicon: String,
    status: { type: String, enum: ['success', 'error'], default: 'success' },
    seoScore: { type: Number, default: 0 } // We will calculate this later
}, { timestamps: true });

module.exports = mongoose.model('ScrapeRecord', scrapeRecordSchema);