import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');

        if (token) {
            setIsAuthenticated(true);
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (e) {
                    console.error("Failed to parse user data", e);
                }
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authApi.signIn({ email, password });
            // Spec: response.data = { accessToken, accountId, email, name, role }
            // Structure of successful response: { data: { ... } }
            // So response might be the axios response data which is { data: { ... } }
            // Let's verify authApi.signIn returns response.data.
            // If server returns { "data": { ... } }, then axios response.data is equivalent to that object.
            // So `data` in `const { data } = response` would be the inner data object.

            const { data } = response;

            if (data && data.accessToken) {
                localStorage.setItem('accessToken', data.accessToken);
                // Save user info mostly for display, exclude sensitive info if any
                const userData = {
                    accountId: data.accountId,
                    email: data.email,
                    name: data.name,
                    role: data.role
                };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
                setIsAuthenticated(true);
                return { success: true };
            }
            return { success: false, message: "Invalid response from server" };

        } catch (error) {
            console.error("Login failed", error);
            // Construct error message based on spec
            // 400 INVALID_EMAIL, MISSING_PARAMETER
            // 401 AUTH_INVALID_CREDENTIALS
            let message = "Login failed";
            if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            throw new Error(message);
        }
    };

    const register = async (email, name, password) => {
        try {
            const response = await authApi.signUp({ email, name, password });
            return { success: true, data: response.data };
        } catch (error) {
            let message = "Registration failed";
            if (error.response?.data?.message) {
                message = error.response.data.message;
            }
            throw new Error(message);
        }
    };

    const logout = async () => {
        try {
            await authApi.signOut();
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            // Always clear local state
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const checkEmail = async (email) => {
        return authApi.checkEmail({ email });
    };

    const requestTempPassword = async (email) => {
        return authApi.requestTempPassword({ email });
    };

    const resetPassword = async (email, newPassword) => {
        return authApi.resetPassword({ email, newPassword });
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            logout,
            register,
            checkEmail,
            requestTempPassword,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
