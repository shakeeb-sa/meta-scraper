require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(cors());

// --- 1. PRO-DATABASE CONNECTION (Vercel Stable Pattern) ---
const MONGO_URI = process.env.MONGO_URI;

// Disable buffering so we get immediate errors if DB is down
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    
    try {
        const db = await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Wait 5s before failing
        });
        isConnected = db.connections[0].readyState;
        console.log("🚀 MongoDB Connected successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        // Don't process.exit here, let the middleware handle the retry
    }
};

// Middleware: FORCE wait for DB on every request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Middleware: Ensure DB is connected
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// --- 2. Test Route ---
app.get('/', (req, res) => {
    res.send(`MetaScraper PRO API is Online. DB Connected: ${isConnected ? 'Yes' : 'No'}`);
});

// --- 3. Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scrape', require('./routes/scrapeRoutes'));

// --- 4. EXPORT / START ---
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Backend running locally on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;;