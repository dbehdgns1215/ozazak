import axios from 'axios';

/**
 * Centralized Axios instance for all API calls.
 * 
 * During development, all requests go through the dev server proxy (setupProxy.js)
 * which forwards requests to the backend, avoiding CORS issues.
 * 
 * baseURL: "/api" ensures all requests use relative paths.
 * The proxy then routes these to the actual backend.
 */
const client = axios.create({
    // baseURL: 'http://localhost:8080/api',
    baseURL: process.env.REACT_APP_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to headers
client.interceptors.request.use(
    (config) => {
        // Try localStorage first, then fallback to env token
        let token = localStorage.getItem('accessToken');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
