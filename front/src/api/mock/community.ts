import { mockTilList, mockCommunityPosts, mockComments as mockCommentsData, mockCommunityCategories } from './communityData';

export interface AuthorProfile {
    userId?: string;
    nickname: string;
    profileImage: string;
}

export interface TILItem {
    id: string | number; // Allow both for flexibility or migration
    title: string;
    content: string;
    author: AuthorProfile; // Changed from string to object
    date: string;
    tags: string[];
    reactions: number;
    commentsCount?: number;
    isLiked?: boolean;
}

export interface PostItem {
    id: string | number;
    category: string;
    title: string;
    content?: string;
    author: AuthorProfile | string; // Handle both for now
    createdAt?: string; // date in mockData
    date?: string;
    views: number;
    likes?: number; // reactions
    comments?: number; // count
    commentsCount?: number;
    isLiked?: boolean;
}

export const mockComments = mockCommentsData;

export const communityApi = {
    getTILs: async (filter?: any): Promise<TILItem[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Return imported mock data
                // Need to cast or ensure data matches interface
                resolve(mockTilList as unknown as TILItem[]);
            }, 500);
        });
    },

    toggleTILReaction: async (tilId: string | number) => new Promise(r => setTimeout(() => r({ success: true }), 500)),

    getCategories: async () => new Promise(r => setTimeout(() => r(mockCommunityCategories), 500)),

    getPosts: async (category?: string): Promise<PostItem[]> => new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockCommunityPosts as unknown as PostItem[]);
        }, 500);
    }),

    getPostDetail: async (postId: string | number) => new Promise(r => setTimeout(() => {
        const found = mockCommunityPosts.find(p => p.id == postId);
        r(found || mockCommunityPosts[0]);
    }, 500)),

    createPost: async (data: any) => new Promise(r => setTimeout(() => r({ id: Math.random(), ...data }), 500)),
    updatePost: async (postId: string | number, data: any) => new Promise(r => setTimeout(() => r({ id: postId, ...data }), 500)),
    deletePost: async (postId: string | number) => new Promise(r => setTimeout(() => r(true), 500)),

    getComments: async (postId: string | number) => new Promise(r => setTimeout(() => r(mockCommentsData), 500)),

    addComment: async (postId: string | number, content: string) => new Promise(r => setTimeout(() => r({ id: Math.random(), content }), 500)),
};
