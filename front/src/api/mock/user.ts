export interface UserProfile {
    id: number;
    email: string;
    nickname: string;
    profileImage: string;
    bio: string;
    jobRole: string;
    skills: string[];
}

export interface UserStreak {
    date: string; // YYYY-MM-DD
    count: number;
}

export interface Applier {
    id: number;
    company: string;
    status: string;
    date: string;
}

export interface RecordItem {
    id: number;
    title: string;
    period: string;
    detail: string;
}

const MOCK_USER: UserProfile = {
    id: 1,
    email: 'test@ssafy.com',
    nickname: '싸피러',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    bio: '매일매일 성장하는 개발자입니다.',
    jobRole: 'Frontend Developer',
    skills: ['React', 'TypeScript', 'TailwindCSS'],
};

export const userApi = {
    getUserProfile: async (userId: string | number): Promise<UserProfile> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ...MOCK_USER, id: Number(userId) });
            }, 500);
        });
    },

    updateUserProfile: async (userId: string | number, data: Partial<UserProfile>): Promise<UserProfile> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ...MOCK_USER, ...data });
            }, 500);
        });
    },

    deleteUser: async (userId: string | number): Promise<void> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    },

    getStreak: async (userId: string | number): Promise<UserStreak[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generate last 365 days streak data mock
                const streaks = Array.from({ length: 365 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return {
                        date: d.toISOString().split('T')[0],
                        count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
                    };
                }).reverse();
                resolve(streaks);
            }, 500);
        });
    },

    manageRecord: {
        list: async (userId: string | number): Promise<RecordItem[]> => new Promise(r => setTimeout(() => r([
            { id: 1, title: '삼성청년SW아카데미 11기', period: '2024.01 - 2024.12', detail: '웹/모바일 트랙 수료' },
            { id: 2, title: '스타트업 인턴', period: '2023.06 - 2023.08', detail: '프론트엔드 개발 보조' }
        ]), 500)),
        create: async (userId: string | number, data: any) => new Promise(r => setTimeout(() => r({ id: Math.random(), ...data }), 500)),
        update: async (userId: string | number, data: any) => new Promise(r => setTimeout(() => r({ ...data }), 500)),
        delete: async (userId: string | number, id: any) => new Promise(r => setTimeout(() => r(true), 500)),
    },

    getAppliers: async (userId: string | number): Promise<Applier[]> => new Promise(r => setTimeout(() => r([
        { id: 1, company: '네이버', status: '서류합격', date: '2025-03-01' },
        { id: 2, company: '토스', status: '진행중', date: '2025-02-28' },
    ]), 500)),

    follow: async (userId: string | number) => new Promise(r => setTimeout(() => r({ message: 'Followed' }), 500)),
    unfollow: async (userId: string | number) => new Promise(r => setTimeout(() => r({ message: 'Unfollowed' }), 500)),
    getFollowers: async (userId: string | number): Promise<any[]> => new Promise(r => setTimeout(() => r([{ id: 2, name: 'Follower 1' }]), 500)),
    getFollowees: async (userId: string | number): Promise<any[]> => new Promise(r => setTimeout(() => r([{ id: 3, name: 'Following 1' }]), 500)),
};
