// src/api/mockData.js

export const mockUserProfile = {
    userId: "user_001",
    email: "user@example.com",
    name: "Mock User",
    nickname: "RunningTurtle",
    level: 5,
    exp: 2450,
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    bio: "Love running and coding!",
    joinedAt: "2023-01-15T09:00:00Z",
};

export const mockAuthResponse = {
    accessToken: "mock_access_token_123456789",
    accountId: "user_001",
    email: "user@example.com",
    name: "Mock User",
    role: "USER"
};

export const mockCheckEmailResponse = {
    isAvailable: true,
    message: "This email is available."
};

export const mockRecords = [
    {
        id: "rec_101",
        date: "2024-01-20",
        distance: 5.2, // km
        time: "00:30:15",
        pace: "5:49",
        location: "Seoul Han River Park"
    },
    {
        id: "rec_102",
        date: "2024-01-18",
        distance: 3.0,
        time: "00:18:00",
        pace: "6:00",
        location: "Neighborhood Park"
    }
];

export const mockAwards = [
    { id: "awd_1", title: "First 5k", date: "2023-02-01", icon: "🏅" },
    { id: "awd_2", title: "Early Bird", date: "2023-03-10", icon: "🌅" }
];
