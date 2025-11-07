const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors()); // Allows requests from our frontend
app.use(express.json({ limit: '10kb' })); // Allows server to read JSON and limits input size

// --- Helper Function for Scraping a Single URL ---
// This async function takes one URL and returns its metadata
const scrapeUrl = async (url) => {
  try {
    // Fetch the HTML content of the page. We add a User-Agent header to mimic a browser
    // and a timeout to prevent requests from hanging too long.
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000 // 10 second timeout
    });

    // Load the HTML into Cheerio for easy parsing
    const $ = cheerio.load(data);

    // This is the NEW, improved line
const title = ($('title').contents().first().text() || $('title').text()).trim() || 'No Title Found';
    
    // Extract the meta description
    const description = $('meta[name="description"]').attr('content')?.trim() || 'No Description Found';

    // Return the successfully scraped data
    return {
      status: 'success',
      url,
      result: `${title}; ${description}`
    };

  } catch (error) {
    // If anything goes wrong (network error, timeout, etc.), we return an error status
    console.error(`Error scraping ${url}:`, error.message);
    return {
      status: 'error',
      url,
      reason: `Failed to scrape. (${error.message})`
    };
  }
};


// --- The Main API Endpoint ---
app.post('/api/scrape', async (req, res) => {
  // 1. Get URLs from the request body
  const { urls } = req.body;

  // 2. Validate the input
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ message: 'Please provide an array of URLs.' });
  }

  // 3. De-duplicate URLs using a Set for efficiency
  const uniqueUrls = [...new Set(urls.filter(url => url.trim() !== ''))];

  try {
    // 4. Create an array of scraping "promises"
    // .map() creates a new array by calling scrapeUrl for each unique URL
    const scrapePromises = uniqueUrls.map(url => scrapeUrl(url));

    // 5. Execute all promises in parallel and wait for them all to finish
    // Promise.allSettled is perfect because it won't stop if one URL fails
    const settledResults = await Promise.allSettled(scrapePromises);
    
    // 6. Process the results
    const responseData = settledResults.map(result => {
        // If the promise was fulfilled, result.value will contain our object
        if (result.status === 'fulfilled') {
            return result.value;
        }
        // If the promise was rejected (an unexpected error), return a generic error
        return {
            status: 'error',
            reason: 'An unexpected error occurred during scraping.'
        };
    });

    // 7. Send the final array of results back to the frontend
    res.json({ data: responseData });

  } catch (error) {
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
});

// Start the server (for local development)
if (process.env.NODE_ENV !== 'test') { // A check to not run listen in test environments
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

// Export the app for Vercel
module.exports = app;