const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.use(cors());
app.use(express.json());

// Helper Function
const scrapeUrl = async (url) => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      // LOWER TIMEOUT: Set to 6s so we respond before Vercel kills the function at 10s
      timeout: 6000 
    });

    const $ = cheerio.load(data);
    const title = ($('title').contents().first().text() || $('title').text()).trim() || 'No Title Found';
    const description = $('meta[name="description"]').attr('content')?.trim() || 'No Description Found';

    return {
      status: 'success',
      url,
      result: `${title}; ${description}`
    };

  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return {
      status: 'error',
      url,
      reason: `Failed to scrape. (${error.message})`
    };
  }
};

// HANDLER FUNCTION
const handleScrape = async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of URLs.' });
    }

    const uniqueUrls = [...new Set(urls.filter(url => url.trim() !== ''))];
    
    // Scrape
    const scrapePromises = uniqueUrls.map(url => scrapeUrl(url));
    const settledResults = await Promise.allSettled(scrapePromises);
    
    const responseData = settledResults.map(result => {
        if (result.status === 'fulfilled') return result.value;
        return { status: 'error', reason: 'Unexpected error.' };
    });

    res.json({ data: responseData });

  } catch (error) {
    console.error("Critical Server Error:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// ROUTING FIX:
// Vercel sometimes strips the path, sometimes it doesn't. 
// We listen on both to be safe.
app.post('/api/scrape', handleScrape);
app.post('/', handleScrape);

// Health check to verify API is running
app.get('/api/scrape', (req, res) => res.send('Scraper API is running! Send a POST request.'));

module.exports = app;