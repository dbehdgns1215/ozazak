import client from './client';

// Use centralized client instance (configured with baseURL: '/api')
// All requests go through the dev server proxy to avoid CORS issues

export const signIn = async ({ email, password }) => {
    const response = await client.post('/auth/signin', { email, password });
    return response.data;
};

export const signUp = async ({ email, name, password, verificationToken }) => {
    const response = await client.post('/auth/signup', { email, name, password, verificationToken });
    return response.data;
};

export const signOut = async () => {
    // Client-side logout mainly, but if server has endpoint calling it is good practice
    // const response = await client.post('/auth/signout', {});
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
    const response = await client.post('/auth/check-email', { email });
    return response.data;
};

export const sendVerificationCode = async (email) => {
    // POST /api/auth/email/verification/request
    const response = await client.post('/auth/email/verification/request', { email });
    return response.data;
};

export const confirmVerificationCode = async (email, code) => {
    // POST /api/auth/email/verification/confirm
    const response = await client.post('/auth/email/verification/confirm', { email, code });
    return response.data; // Returns { verificationToken: "..." }
};

export const requestPasswordReset = async (email) => { // Renamed from requestTempPassword to better reflect functionality
    // POST /api/auth/temp-password (as per user, though traditionally separate)
    const response = await client.post('/auth/temp-password', { email });
    return response.data;
};

export const resetPassword = async ({ email, resetToken, newPassword }) => {
    // PUT /api/auth/password
    const response = await client.put('/auth/password', { email, resetToken, newPassword });
    return response.data;
};

export const getMe = async () => {
    const response = await client.get('/me');
    return response.data;
};

export default client;
