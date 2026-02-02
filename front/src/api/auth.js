import axios from 'axios';

// Create an axios instance with a default config
const api = axios.create({
    // baseURL: 'http://localhost:8080', // Direct to backend
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',

    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const signIn = async ({ email, password }) => {
    const response = await api.post('/api/auth/signin', { email, password });
    return response.data;
};

export const signUp = async ({ email, name, password, verificationToken }) => {
    const response = await api.post('/api/auth/signup', { email, name, password, verificationToken });
    return response.data;
};

export const signOut = async () => {
    // Client-side logout mainly, but if server has endpoint calling it is good practice
    // const response = await api.post('/api/auth/signout', {});
    // return response.data;
    // For now, since backend is JWT stateless, client side removal is enough. 
    // If backend has blacklist, we might need a call.
    return { success: true };
};

export const checkEmail = async ({ email }) => {
    // Legacy endpoint, keeping if needed or redirecting logic
    // But for signup we now use verification flow.
    // Let's keep it if used elsewhere, but user asked for verification flow.
    // The previous checkEmail was for duplicates?
    const response = await api.post('/api/auth/check-email', { email });
    return response.data;
};

export const sendVerificationCode = async (email) => {
    // POST /api/auth/email/verification/request
    const response = await api.post('/api/auth/email/verification/request', { email });
    return response.data;
};

export const confirmVerificationCode = async (email, code) => {
    // POST /api/auth/email/verification/confirm
    const response = await api.post('/api/auth/email/verification/confirm', { email, code });
    return response.data; // Returns { verificationToken: "..." }
};

export const requestPasswordReset = async (email) => { // Renamed from requestTempPassword to better reflect functionality
    // POST /api/auth/temp-password (as per user, though traditionally separate)
    const response = await api.post('/api/auth/temp-password', { email });
    return response.data;
};

export const resetPassword = async ({ email, resetToken, newPassword }) => {
    // PUT /api/auth/password
    const response = await api.put('/api/auth/password', { email, resetToken, newPassword });
    return response.data;
};

export const getMe = async () => {
    const response = await api.get('/api/me');
    return response.data;
};

export default api;
