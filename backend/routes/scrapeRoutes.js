const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const { protect } = require('../middleware/auth');
const ScrapeRecord = require('../models/ScrapeRecord');

// Helper: Calculate SEO Score (Brilliant Feature)
const calculateSeoScore = (title, description, ogImage) => {
    let score = 0;
    if (title && title !== 'No Title Found') score += 30;
    if (description && description !== 'No Description Found') score += 30;
    if (ogImage) score += 20;
    
    // Length checks
    if (title.length >= 40 && title.length <= 60) score += 10;
    if (description.length >= 120 && description.length <= 160) score += 10;
    
    return score;
};

// @route   POST /api/scrape
// @desc    Scrape metadata and save to DB
// @access  Private
router.post('/', protect, async (req, res) => {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ message: 'Please provide an array of URLs' });
    }

    const axiosInstance = axios.create({
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        timeout: 10000
    });

    const scrapeResults = [];

    for (let url of urls) {
        let targetUrl = url.trim();
        if (!targetUrl.startsWith('http')) targetUrl = 'https://' + targetUrl;

        try {
            const { data } = await axiosInstance.get(targetUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36' }
            });

            const $ = cheerio.load(data);
            const title = ($('title').text() || '').trim() || 'No Title Found';
            const description = $('meta[name="description"]').attr('content') || 
                                $('meta[property="og:description"]').attr('content') || 
                                'No Description Found';
            const ogImage = $('meta[property="og:image"]').attr('content') || '';
            const favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || '';

            const seoScore = calculateSeoScore(title, description, ogImage);

            // Save to MongoDB
            const record = await ScrapeRecord.create({
                userId: req.user._id,
                url: targetUrl,
                title,
                description,
                ogImage,
                favicon,
                seoScore
            });

            scrapeResults.push(record);
        } catch (error) {
            scrapeResults.push({ url: targetUrl, status: 'error', reason: error.message });
        }
    }

    res.json(scrapeResults);
});

// @route   GET /api/scrape/history
// @desc    Get current user's scrape history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const history = await ScrapeRecord.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;