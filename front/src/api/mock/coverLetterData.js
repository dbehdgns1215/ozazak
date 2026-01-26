export const mockCoverLetters = [
    {
        id: "cv_001",
        title: "Naver Frontend 2026",
        company: "Naver",
        job: "Frontend Developer",
        status: "WRITING", // WRITING, COMPLETED
        updatedAt: "2024-01-20T10:00:00Z"
    },
    {
        id: "cv_002",
        title: "Kakao Backend 2026",
        company: "Kakao",
        job: "Backend Developer",
        status: "COMPLETED",
        updatedAt: "2024-01-15T10:00:00Z"
    }
];

export const mockCoverLetterQuestions = [
    { id: "q_1", content: "Why do you want to join us?", limit: 500 },
    { id: "q_2", content: "Describe your difficult experience.", limit: 1000 }
];

export const mockEssays = [
    {
        id: "essay_1",
        questionId: "q_1",
        title: "Motivation",
        content: "I want to grow with...",
        version: 1
    }
];

export const mockBlocks = [
    { id: "blk_1", category: "Personality", content: "I am a fast learner." },
    { id: "blk_2", category: "Technical", content: "Skilled in React." }
];
