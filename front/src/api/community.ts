import client from './client';

// --- Type Definitions ---
export type TILAuthor = {
    accountId: number;
    name: string;
    img: string | null;
    companyName: string | null;
};

export type TILItem = {
    tilId: number;
    title: string;
    content: string;
    author: TILAuthor;
    tags: string[];
    view: number;
    commentCount: number;
    reaction: any[];
    createdAt: string;
};

export type TILListResponse = {
    data?: TILItem[];
    items?: TILItem[];
    hasNext?: boolean;
    pageInfo?: {
        hasNext?: boolean;
        totalPages?: number;
        totalElements?: number;
    };
};

export type ProjectAuthor = {
    accountId: number;
    name: string;
    img: string | null;
};

export type ProjectItem = {
    projectId: number;
    title: string;
    content: string;
    author: ProjectAuthor;
    tags: string[];
    view: number;
    commentCount: number;
    reaction: any[];
    createdAt: string;
    githubUrl?: string;
    demoUrl?: string;
};

export type ProjectListResponse = {
    data?: ProjectItem[];
    items?: ProjectItem[];
    hasNext?: boolean;
    pageInfo?: {
        hasNext?: boolean;
        totalPages?: number;
        totalElements?: number;
    };
};

export type Comment = {
    id: number;
    content: string;
    authorId: number;
    authorName: string;
    createdAt: string;
};

// --- TIL APIs ---

/**
 * Get TIL list with pagination and filters
 * @param params - page, size, communityCode, tags, authorStatus, authorId
 */
export const getTILList = async (params?: {
    page?: number;
    size?: number;
    communityCode?: number;
    tags?: string;
    authorStatus?: string;
    authorId?: number;
}): Promise<TILListResponse> => {
    const response = await client.get('/til', { params });
    // Backend returns { message, data }
    return response.data.data || response.data;
};

/**
 * Get TIL detail by ID
 * Returns the full response object for flexibility
 * Backend uses /api/community/{communityId} for all community posts including TILs
 */
export const getTILDetail = async (tilId: number | string): Promise<any> => {
    const response = await client.get(`/community/${tilId}`);
    // Backend returns { message, data }
    return response.data.data || response.data;
};

// Alias for backward compatibility
export const getTilDetail = getTILDetail;

/**
 * Create new TIL post
 */
export const createTIL = async (tilData: {
    title: string;
    content: string;
    tags?: string[];
}) => {
    const response = await client.post('/til', tilData);
    return response.data;
};

/**
 * Update TIL post
 */
export const updateTIL = async (tilId: number, tilData: {
    title?: string;
    content?: string;
    tags?: string[];
}) => {
    const response = await client.put(`/til/${tilId}`, tilData);
    return response.data;
};

/**
 * Delete TIL post
 */
export const deleteTIL = async (tilId: number) => {
    const response = await client.delete(`/til/${tilId}`);
    return response.data;
};

/**
 * Toggle TIL reaction (like)
 */
export const toggleTILReaction = async (tilId: number) => {
    const response = await client.put(`/til/${tilId}/reaction`);
    return response.data;
};

// Alias for backward compatibility
export const toggleTilReaction = toggleTILReaction;

/**
 * Add TIL reaction
 */
export const addTILReaction = async (tilId: number | string, type: number = 0) => {
    const response = await client.post(`/til/${tilId}/reaction`, {
        reaction: { type }
    });
    return response.data;
};

// Alias for backward compatibility
export const addTilReaction = addTILReaction;

/**
 * Remove TIL reaction
 */
export const removeTILReaction = async (tilId: number | string, type?: number) => {
    const response = await client.delete(`/til/${tilId}/reaction`, {
        data: type !== undefined ? { reaction: { type } } : undefined
    });
    return response.data;
};

// Alias for backward compatibility
export const removeTilReaction = removeTILReaction;

// --- Legacy TIL API from old community.js ---
export const getTils = async (params?: any) => {
    const response = await client.get('/til', { params });
    return response.data;
};

// --- Project APIs ---

/**
 * Get Project list with pagination and filters
 */
export const getProjectList = async (params?: {
    page?: number;
    size?: number;
    tags?: string;
    authorId?: number;
}): Promise<ProjectListResponse> => {
    const response = await client.get('/projects', { params });
    // Backend returns { message, data }
    return response.data.data || response.data;
};

/**
 * Get Project detail by ID
 */
export const getProjectDetail = async (projectId: number): Promise<ProjectItem> => {
    const response = await client.get(`/projects/${projectId}`);
    // Backend returns { message, data }
    return response.data.data || response.data;
};

/**
 * Create new Project post
 */
export const createProject = async (projectData: {
    title: string;
    content: string;
    tags?: string[];
    githubUrl?: string;
    demoUrl?: string;
}) => {
    const response = await client.post('/projects', projectData);
    return response.data;
};

/**
 * Update Project post
 */
export const updateProject = async (projectId: number, projectData: {
    title?: string;
    content?: string;
    tags?: string[];
    githubUrl?: string;
    demoUrl?: string;
}) => {
    const response = await client.put(`/projects/${projectId}`, projectData);
    return response.data;
};

/**
 * Delete Project post
 */
export const deleteProject = async (projectId: number) => {
    const response = await client.delete(`/projects/${projectId}`);
    return response.data;
};

/**
 * Toggle Project reaction
 */
export const toggleProjectReaction = async (projectId: number) => {
    const response = await client.put(`/projects/${projectId}/reaction`);
    return response.data;
};

// --- Community Posts (Legacy from old community.js) ---

export const getCommunityCategories = async () => {
    const response = await client.get('/community-category');
    return response.data;
};

export const getCommunityPosts = async (params?: any) => {
    const response = await client.get('/community-post', { params });
    return response.data;
};

export const getCommunityPostDetail = async (communityId: string | number) => {
    const response = await client.get(`/community/${communityId}`);
    return response.data;
};

export const createCommunityPost = async (postData: any) => {
    console.log('[API] createCommunityPost Request:', postData);
    try {
        const response = await client.post('/community', postData);
        console.log('[API] createCommunityPost Response:', response);
        return response.data;
    } catch (error) {
        console.error('[API] createCommunityPost Error:', error);
        throw error;
    }
};

export const addCommunityReaction = async (communityId: string | number, code = 1) => {
    const response = await client.post(`/community/${communityId}/reaction`, {
        reaction: { code }
    });
    return response.data;
};

export const removeCommunityReaction = async (communityId: string | number) => {
    const response = await client.delete(`/community/${communityId}/reaction`);
    return response.data;
};

// --- Comments (TIL & Project 공통) ---

/**
 * Get comments for a post (accepts both string and number for flexibility)
 * Returns response with flexible structure to handle different API response formats
 */
export const getComments = async (postId: string | number): Promise<any> => {
    const response = await client.get(`/community-posts/${postId}/comments`);
    return response.data;
};

/**
 * Create a comment (accepts both string and number for postId)
 */
export const createComment = async (postId: string | number, content: string) => {
    const response = await client.post(`/community-posts/${postId}/comments`, { content });
    return response.data;
};

/**
 * Update a comment
 */
export const updateComment = async (commentId: number, content: string) => {
    const response = await client.put(`/community-comments/${commentId}`, { content });
    return response.data;
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: number) => {
    const response = await client.delete(`/community-comments/${commentId}`);
    return response.data;
};
