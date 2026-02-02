export interface SigninResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        email: string;
        nickname: string;
        profileImage: string;
    };
}

export const authApi = {
    signin: async (email: string, password: string): Promise<SigninResponse> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'test@ssafy.com' && password === '1234') {
                    resolve({
                        accessToken: 'mock_access_token_12345',
                        refreshToken: 'mock_refresh_token_67890',
                        user: {
                            id: 1,
                            email: 'test@ssafy.com',
                            nickname: '싸피러',
                            profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                        },
                    });
                } else {
                    reject(new Error('이메일 또는 비밀번호가 일치하지 않습니다.'));
                }
            }, 500);
        });
    },

    signup: async (data: any): Promise<{ message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: '회원가입이 완료되었습니다.' });
            }, 500);
        });
    },

    signout: async (): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    },

    checkEmail: async (email: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock: always return true for available (except specific existing)
                resolve(email !== 'exist@ssafy.com');
            }, 500);
        });
    },

    requestTempPassword: async (email: string): Promise<{ message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: '임시 비밀번호가 이메일로 전송되었습니다.' });
            }, 500);
        });
    },

    resetPassword: async (password: string): Promise<{ message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: '비밀번호가 성공적으로 변경되었습니다.' });
            }, 500);
        });
    }
};
