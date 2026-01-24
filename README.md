# Meta Scraper Pro 🔍

**Meta Scraper Pro** is a robust, full-stack web application built with **React** and **Express.js** designed to extract and visualize metadata from any public URL. It utilizes server-side scraping to bypass CORS restrictions, providing a seamless experience for previewing how links will appear on social media and search engines.

## 🚀 Key Features

-   **Instant Meta Extraction**: Retrieves essential tags including Page Title, Meta Description, Favicons, and Open Graph (OG) images.
    
-   **Live Preview Cards**: Features a dynamic "Social Preview" section that mimics how the scraped data will look on platforms like Facebook, X (Twitter), and LinkedIn.
    
-   **CORS-Free Architecture**: Uses a dedicated Express backend to perform scraping via Axios and Cheerio, ensuring reliable data retrieval from restricted sites.
    
-   **Copy-to-Clipboard**: Quickly copy any extracted metadata field with a single click.
    
-   **Responsive Dashboard**: A modern, single-page interface with a clean "Glassmorphism" design that works perfectly on desktop and mobile.
    
-   **Health Monitoring**: Built-in API health checks to ensure the scraping engine is active and responsive.
    

## 🛠️ Tech Stack

-   **Frontend**: React 18+ with Vite for high-speed development and optimized production builds.
    
-   **Backend**: Node.js & Express.js for the scraping API.
    
-   **Scraping Engine**:
    
    -   **Axios**: For making robust HTTP requests.
        
    -   **Cheerio**: For fast and flexible HTML parsing.
        
-   **Styling**: Modern CSS with a focus on usability and professional aesthetics.
    
-   **Deployment**: Optimized for Vercel/Render with specific routing fixes for serverless environments.
    

## 📁 Project Structure

Plaintext

```
├── api/               # Express backend (Serverless functions)
│   └── index.js       # Scraping logic and API routes
├── client/            # React frontend
│   ├── src/
│   │   ├── App.jsx    # Main application logic
│   │   └── App.css    # UI styling
├── package.json       # Workspace dependencies
└── vercel.json        # Deployment configuration

```

## ⚙️ Installation & Development

1.  **Clone the repository**:
    
    Bash
    
    ```
    git clone https://github.com/your-username/meta-scraper.git
    cd meta-scraper
    
    ```
    
2.  **Install dependencies**:
    
    Bash
    
    ```
    npm install
    cd client && npm install
    
    ```
    
3.  **Start the Backend**:
    
    Bash
    
    ```
    npm start
    
    ```
    
4.  **Start the Frontend**:
    
    Bash
    
    ```
    cd client
    npm run dev
    
    ```
    

## 📖 How it Works

The application takes a URL from the user, sends a POST request to the `/api/scrape` endpoint, and the server-side engine fetches the HTML. It then parses the document to find `<meta>`, `<title>`, and `<link>` tags, returning a clean JSON object to the React frontend for display.

----------

Developed by [Shakeeb](https://shakeeb-sa.github.io/). Built for speed, accuracy, and SEO transparency.
