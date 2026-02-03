export const mockUserProfile = {
    userId: "user_001",
    email: "user@example.com",
    name: "Yeonwoo Kim",
    nickname: "RunningTurtle",
    level: 5,
    exp: 2450,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    bio: "Passionate developer and runner.",
    joinedAt: "2023-01-15T09:00:00Z",
    role: "USER"
};

export const mockUserStreak = {
    currentStreak: 5,
    maxStreak: 14,
    streakHistory: [
        "2024-01-20", "2024-01-21", "2024-01-22", "2024-01-23", "2024-01-24"
    ]
};

export const mockRecords = [
    {
        id: "rec_101",
        title: "Morning Routine",
        date: "2024-01-20",
        category: "Study",
        content: "Studied React Hooks for 2 hours.",
        link: "https://github.com/user/project"
    },
    {
        id: "rec_102",
        title: "Algorithm Practice",
        date: "2024-01-18",
        category: "Coding",
        content: "Solved 3 LeetCode problems.",
        link: ""
    }
];

export const mockAwards = [
    { id: "awd_1", title: "SSAFY 10th Hackathon Gold", date: "2023-11-20", issuer: "SSAFY" },
    { id: "awd_2", title: "Opic IM2", date: "2023-05-10", issuer: "ACTFL" }
];

export const mockCertifications = [
    { id: "cert_1", title: "SQLD", date: "2023-09-01", issuer: "KData" },
    { id: "cert_2", title: "ADsP", date: "2023-03-15", issuer: "KData" }
];

export const mockAppliers = [
    { recruitmentId: "rec_001", companyName: "Naver", position: "Frontend", status: "APPLIED", date: "2024-01-10" },
    { recruitmentId: "rec_002", companyName: "Kakao", position: "Backend", status: "DOCUMENT_PASSED", date: "2024-01-05" }
];

export const mockFollowers = [
    { userId: "user_002", nickname: "CoderOne", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coco" },
    { userId: "user_003", nickname: "DevKing", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack" }
];
