export interface TILItem {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
    tags: string[];
    reactions: number;
}

export interface PostItem {
    id: number;
    category: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    views: number;
    commentsCount: number;
}

export const communityApi = {
    getTILs: async (filter?: any): Promise<TILItem[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 1, title: '오늘의 알고리즘', content: 'DFS/BFS 정복하기...', author: '싸피러1', date: '2025-01-27', tags: ['Algorithm', 'Python'], reactions: 10 },
                    { id: 2, title: 'IsNextJS Good?', content: 'Next.js 14 server actions...', author: 'FE_Dev', date: '2025-01-26', tags: ['React', 'NextJS'], reactions: 5 },
                    { id: 3, title: 'Docker Compose 활용', content: '로컬 개발 환경 세팅...', author: 'Be_Master', date: '2025-01-25', tags: ['DevOps'], reactions: 12 },
                ]);
            }, 500);
        });
    },

    toggleTILReaction: async (tilId: number) => new Promise(r => setTimeout(() => r({ success: true }), 500)),

    getCategories: async () => new Promise(r => setTimeout(() => r(['자유게시판', '질문게시판', '취업정보', '스터디모집']), 500)),

    getPosts: async (category?: string) => new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, category: '질문게시판', title: 'React Hook 질문있습니다', content: 'useEffect 의존성 배열...', author: 'Newbie', createdAt: '2025-01-27', views: 42, commentsCount: 3 },
                { id: 2, category: '자유게시판', title: '취업 준비 힘들다', content: '다들 화이팅...', author: 'JobSeeker', createdAt: '2025-01-26', views: 105, commentsCount: 12 },
            ]);
        }, 500);
    }),

    getPostDetail: async (postId: number) => new Promise(r => setTimeout(() => r({
        id: postId, title: 'Detail Post Title', content: 'Full content here...', author: 'Author', createdAt: '2025-01-27', views: 100
    }), 500)),

    createPost: async (data: any) => new Promise(r => setTimeout(() => r({ id: Math.random(), ...data }), 500)),
    updatePost: async (postId: number, data: any) => new Promise(r => setTimeout(() => r({ id: postId, ...data }), 500)),
    deletePost: async (postId: number) => new Promise(r => setTimeout(() => r(true), 500)),

    getComments: async (postId: number) => new Promise(r => setTimeout(() => r([
        { id: 1, author: 'Commenter1', content: 'Good post!', createdAt: '2025-01-27' }
    ]), 500)),

    addComment: async (postId: number, content: string) => new Promise(r => setTimeout(() => r({ id: Math.random(), content }), 500)),
};
