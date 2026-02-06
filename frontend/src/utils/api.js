import axios from 'axios';

const API = axios.create({
    // Automatically switches between your office laptop and your live Vercel cloud
    baseURL: window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/api' 
        : 'https://meta-scraper-kg5h.vercel.app/api' 
});

// Add token to every request automatically
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;