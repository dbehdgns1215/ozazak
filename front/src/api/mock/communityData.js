export const mockTilList = [
    {
        id: "til_001",
        author: { userId: "user_002", nickname: "CoderOne", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coco" },
        title: "React 19 Server Components",
        content: "Learned about Server Components...",
        tags: ["React", "Frontend"],
        reactions: 24,
        date: "2024-01-25T14:00:00Z"
    },
    {
        id: "til_002",
        author: { userId: "user_001", nickname: "RunningTurtle", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
        title: "TypeScript Generics",
        content: "Deep dive into Generics...",
        tags: ["TypeScript", "Study"],
        reactions: 15,
        date: "2024-01-24T10:00:00Z"
    }
];

export const mockCommunityCategories = [
    { code: "FREE", name: "자유게시판" },
    { code: "QNA", name: "질문게시판" },
    { code: "INFO", name: "정보공유" }
];

export const mockCommunityPosts = [
    {
        id: "post_001",
        category: "FREE",
        title: "Any study tips for SSAFY?",
        author: "NewBie",
        views: 120,
        comments: 5,
        date: "2024-01-26T09:00:00Z"
    }
];

export const mockComments = [
    { id: "cmt_1", author: "Senior", content: "Just code everyday!", date: "2024-01-26T09:30:00Z" }
];
