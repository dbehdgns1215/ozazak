import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authApi from '../api/auth';

// Type for the user object
interface User {
    accountId: number;
    email: string;
    name: string;
    role: string;
}

// Type for the context value
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    register: (email: string, name: string, password: string, verificationToken: string) => Promise<any>;
    logout: () => Promise<void>;
    checkEmail: (email: string) => Promise<any>;
    requestPasswordReset: (email: string) => Promise<any>;
    resetPassword: (email: string, resetToken: string, newPassword: string) => Promise<any>;
    sendVerificationCode: (email: string) => Promise<any>;
    confirmVerificationCode: (email: string, code: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    loading: true,
    login: async (email: string, password: string) => { },
    register: async (email: string, name: string, password: string, verificationToken: string) => { },
    logout: async () => { },
    checkEmail: async (email: string) => { },
    requestPasswordReset: async (email: string) => { },
    resetPassword: async (email: string, resetToken: string, newPassword: string) => { },
    sendVerificationCode: async (email: string) => { },
    confirmVerificationCode: async (email: string, code: string) => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock login mode for development
        if (process.env.REACT_APP_MOCK_LOGIN === 'true') {
            const mockUser: User = {
                accountId: 1,
                email: "admin1@ssafy.com",
                name: "모의사용자",
                role: "ROLE_ADMIN"
            };
            const mockToken = process.env.REACT_APP_ACCESS_TOKEN || "mock_access_token_123456789";

            localStorage.setItem('accessToken', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));
            setUser(mockUser);
            setIsAuthenticated(true);
            setLoading(false);
            console.log("🔓 Mock login enabled - automatically logged in as:", mockUser.email);
            return;
        }

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

    const login = async (email: string, password: string) => {
        try {
            // 1. Sign in to get the token
            const response = await authApi.signIn({ email, password });

            const accessToken = response.accessToken;

            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);

                try {
                    const meResponse = await authApi.getMe();

                    const userData: User = {
                        accountId: meResponse.accountId,
                        email: meResponse.email,
                        name: meResponse.name,
                        role: meResponse.role
                    };

                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                    setIsAuthenticated(true);
                    return { success: true };

                } catch (meError: any) {
                    console.error("Failed to fetch user info after login", meError);
                    localStorage.removeItem('accessToken');
                    throw new Error("Failed to retrieve user information.");
                }
            } else {
                throw new Error("Invalid response from server (No Access Token)");
            }

        } catch (error: any) {
            console.error("Login failed", error);
            let message = "로그인에 실패했습니다.";
            const errorMsg = error.response?.data?.message || error.message || "";

            if (errorMsg.includes("Invalid") || errorMsg.includes("credentials") || errorMsg.includes("User not found") || errorMsg.includes("Bad credentials")) {
                message = "이메일 또는 비밀번호가 올바르지 않습니다.";
            } else if (errorMsg) {
                message = "로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.";
            }
            throw new Error(message);
        }
    };

    const register = async (email: string, name: string, password: string, verificationToken: string) => {
        try {
            const response = await authApi.signUp({ email, name, password, verificationToken });
            return { success: true, data: response.data };
        } catch (error: any) {
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
        } catch (error: any) {
            console.error("Logout error", error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);

            if (process.env.REACT_APP_MOCK_LOGIN === 'true') {
                setTimeout(() => {
                    const mockUser: User = {
                        accountId: 1,
                        email: "admin1@ssafy.com",
                        name: "모의사용자",
                        role: "ROLE_ADMIN"
                    };
                    const mockToken = process.env.REACT_APP_ACCESS_TOKEN || "mock_access_token_123456789";

                    localStorage.setItem('accessToken', mockToken);
                    localStorage.setItem('user', JSON.stringify(mockUser));
                    setUser(mockUser);
                    setIsAuthenticated(true);
                    console.log("🔓 Mock login re-enabled after logout:", mockUser.email);
                }, 100);
            }
        }
    };

    const checkEmail = async (email: string) => {
        return authApi.checkEmail({ email });
    };

    const requestPasswordReset = async (email: string) => {
        return authApi.requestPasswordReset(email);
    };

    const resetPassword = async (email: string, resetToken: string, newPassword: string) => {
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