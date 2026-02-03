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
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to headers
client.interceptors.request.use(
    (config) => {
        // Try localStorage first, then fallback to env token
        let token = localStorage.getItem('accessToken');

        if (!token && process.env.REACT_APP_ACCESS_TOKEN) {
            token = process.env.REACT_APP_ACCESS_TOKEN;
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 API Request with token:', {
                url: config.url,
                method: config.method,
                hasToken: !!token,
                tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
            });
        } else {
            console.warn('⚠️ API Request without token:', config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
