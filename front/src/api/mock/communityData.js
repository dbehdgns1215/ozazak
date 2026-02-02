export const mockTilList = [
    {
        id: "til_001",
        author: { userId: "user_002", nickname: "CoderOne", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coco" },
        title: "React 19 Server Components",
        content: "Today I learned about React Server Components (RSC). They allow us to render components on the server and send the HTML to the client, reducing bundle size...",
        tags: ["React", "Frontend", "RSC"],
        reactions: 24,
        commentsCount: 5,
        date: "2024-01-25T14:00:00Z",
        isLiked: true
    },
    {
        id: "til_002",
        author: { userId: "user_001", nickname: "RunningTurtle", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
        title: "TypeScript Generics Deep Dive",
        content: "Generics provide a way to make components work with any data type and not restrict to one data type. It works like a variable for types.",
        tags: ["TypeScript", "Study"],
        reactions: 15,
        commentsCount: 2,
        date: "2024-01-24T10:00:00Z",
        isLiked: false
    },
    {
        id: "til_003",
        author: { userId: "user_003", nickname: "AlgoMaster", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bear" },
        title: "DP Algorithm pattern",
        content: "Dynamic Programming is mainly an optimization over plain recursion. Wherever we see a recursive solution that has repeated calls for same inputs, we can optimize it using DP.",
        tags: ["Algorithm", "DP", "Python"],
        reactions: 42,
        commentsCount: 10,
        date: "2024-01-23T18:00:00Z",
        isLiked: true
    }
];

export const mockCommunityCategories = [
    { code: "FREE", name: "자유게시판" },
    { code: "HOT", name: "핫 게시판" },
    { code: "REVIEW", name: "취업 후기" },
    { code: "CORRECTION", name: "자소서 첨삭" },
    { code: "STUDY", name: "스터디 모집" },
    { code: "QNA", name: "질문 & 답변" }
];

export const mockCommunityPosts = [
    {
        id: "post_001",
        category: "FREE",
        title: "Any study tips for SSAFY?",
        content: "I am struggling with the algorithm curriculum. Any tips?",
        author: { nickname: "NewBie", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Newbie" },
        views: 120,
        likes: 15,
        comments: 5,
        date: "2024-01-26T09:00:00Z",
        isLiked: false
    },
    {
        id: "post_002",
        category: "HOT",
        title: "Finally got a job at Naver!",
        content: "It was a long journey but I finally made it. Here are some of my interview questions...",
        author: { nickname: "LuckyGuy", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" },
        views: 1500,
        likes: 120,
        comments: 45,
        date: "2024-01-20T11:00:00Z",
        isLiked: true
    },
    {
        id: "post_003",
        category: "QNA",
        title: "How to fix CORS error?",
        content: "I am getting Access-Control-Allow-Origin error. I am using React and Spring Boot.",
        author: { nickname: "DevHelp", profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev" },
        views: 50,
        likes: 2,
        comments: 3,
        date: "2024-01-27T15:00:00Z",
        isLiked: false
    }
];

export const mockComments = [
    { id: "cmt_1", author: "Senior", content: "Just code everyday and solve 1 problem on BOJ.", date: "2024-01-26T09:30:00Z" },
    { id: "cmt_2", author: "Helper", content: "Check your proxy settings in package.json", date: "2024-01-27T15:30:00Z" }
];
