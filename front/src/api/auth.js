import axios from 'axios';

//
import {
    mockAuthResponse,
    mockCheckEmailResponse
} from './mock/authData';

// Helper to simulate network delay
const SIMULATED_DELAY = 800; // ms
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Create an axios instance with a default config
// You might want to update the baseURL based on your environment
const api = axios.create({
    baseURL: '', // Proxied in development or set absolute URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the access token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.authorization = `${token}`;
            config.headers['authorization'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const signIn = async ({ email, password }) => {
    // --- [Real Code] (Commented out for Mocking) ---
    // const response = await api.post('/api/auth/signin', { email, password });
    // return response.data;
    // -----------------------------------------------

    // [Mock Code]
    await delay(SIMULATED_DELAY);

    // Simulate simple validation logic for demo purposes
    if (email === "fail@test.com") {
        throw { response: { data: { message: "Invalid email or password" } } };
    }

    return {
        data: {
            ...mockAuthResponse,
            email: email // Reflect the signed-in email
        }
    };
};

export const signUp = async ({ email, name, password }) => {
    // --- [Real Code] (Commented out for Mocking) ---
    // const response = await api.post('/api/auth/signup', { email, name, password });
    // return response.data;
    // -----------------------------------------------

    // [Mock Code]
    await delay(SIMULATED_DELAY);
    return {
        data: {
            message: "User registered successfully",
            userId: "mock_new_user_id"
        }
    };
};

export const signOut = async () => {
    // --- [Real Code] (Commented out for Mocking) ---
    // Spec says body is empty JSON object
    // const response = await api.post('/api/auth/signout', {});
    // return response.data;
    // -----------------------------------------------

    // [Mock Code]
    await delay(SIMULATED_DELAY / 2);
    return { success: true };
};

export const checkEmail = async ({ email }) => {
    // --- [Real Code] (Commented out for Mocking) ---
    // const response = await api.post('/api/auth/check-email/', { email });
    // return response.data;
    // -----------------------------------------------

    // [Mock Code]
    await delay(SIMULATED_DELAY);
    if (email === "duplicate@test.com") {
        return { isAvailable: false, message: "Email already in use" };
    }
    return mockCheckEmailResponse;
};

export const requestTempPassword = async ({ email }) => {
    // --- [Real Code] (Commented out for Mocking) ---
    // const response = await api.post('/api/temp-password', { email });
    // return response.data;
    // -----------------------------------------------

    // [Mock Code]
    await delay(SIMULATED_DELAY);
    return { message: "Temporary password sent to your email." };
};

export const resetPassword = async ({ email, newPassword }) => {
    // --- [Real Code] (Commented out for Mocking) ---
    // const response = await api.post('/api/password', { email, newPassword });
    // return response.data;
    // -----------------------------------------------

    // [Mock Code]
    await delay(SIMULATED_DELAY);
    return { message: "Password reset successfully." };
};

export default api;
