import axios from 'axios';

const client = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
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
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default client;
