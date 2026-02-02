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
            // 1. Sign in to get the token
            const response = await authApi.signIn({ email, password });

            // The LoginResponse from backend is just { accessToken: "..." }
            // So response might be { accessToken: "..." } directly if api/auth.js returns response.data
            // We need to check the structure.
            // If auth.js returns response.data, then `response` is the object directly.

            const accessToken = response.accessToken;

            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);

                // 2. Fetch User Info using the new token
                // We need to ensure the token is available for the next request.
                // Since axios interceptor reads from localStorage, it should be fine.
                // But typically it's safer to ensure state consistency or pass token explicitly if needed.
                // Let's rely on localStorage update being synchronous.

                try {
                    const meResponse = await authApi.getMe();
                    // meResponse = { accountId: 1, email: "...", role: "..." }

                    const userData = {
                        accountId: meResponse.accountId,
                        email: meResponse.email,
                        name: meResponse.email, // Use email as name for now as requested
                        role: meResponse.role
                    };

                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                    setIsAuthenticated(true);
                    return { success: true };

                } catch (meError) {
                    console.error("Failed to fetch user info after login", meError);
                    // Login technically succeeded but getting user info failed.
                    // Should we rollback login? Or just proceed with partial state?
                    // Let's rollback for safety.
                    localStorage.removeItem('accessToken');
                    throw new Error("Failed to retrieve user information.");
                }
            } else {
                throw new Error("Invalid response from server (No Access Token)");
            }

        } catch (error) {
            console.error("Login failed", error);
            let message = "로그인에 실패했습니다.";
            const errorMsg = error.response?.data?.message || error.message || "";

            if (errorMsg.includes("Invalid") || errorMsg.includes("credentials") || errorMsg.includes("User not found") || errorMsg.includes("Bad credentials")) {
                message = "이메일 또는 비밀번호가 올바르지 않습니다.";
            } else if (errorMsg) {
                // If it's a specific message we don't know, showing it might be better than generic,
                // but let's try to be safe.
                message = "로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.";
            }
            throw new Error(message);
        }
    };

    const register = async (email, name, password, verificationToken) => {
        try {
            const response = await authApi.signUp({ email, name, password, verificationToken });
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

    const requestPasswordReset = async (email) => {
        return authApi.requestPasswordReset(email);
    };

    const resetPassword = async (email, resetToken, newPassword) => {
        return authApi.resetPassword({ email, resetToken, newPassword });
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            register,
            logout,
            checkEmail,
            requestPasswordReset,
            resetPassword,
            sendVerificationCode: authApi.sendVerificationCode,
            confirmVerificationCode: authApi.confirmVerificationCode,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
