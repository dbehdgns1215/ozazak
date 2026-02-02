import client from './client';
import {
    mockTilList,
    mockCommunityCategories,
    mockCommunityPosts,
    mockComments
} from './mock/communityData';

const SIMULATED_DELAY = 500;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- TIL ---
export const getTils = async () => {
    // [Real Code]
    // const response = await axios.get('/api/til');
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockTilList };
};

export const toggleTilReaction = async (tilId) => {
    // [Real Code]
    // const response = await axios.put(`/api/til/${tilId}/reaction`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { message: "Reaction toggled" };
};

// --- Community ---
export const getCommunityCategories = async () => {
    // [Real Code]
    // const response = await axios.get('/api/community-category');
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockCommunityCategories };
};

export const getCommunityPosts = async (categoryCode) => {
    // [Real Code]
    // const response = await axios.get(`/api/community-post?category=${categoryCode}`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockCommunityPosts }; // Filter logic can be added if needed
};

// Get community post detail by ID
export const getCommunityPostDetail = async (communityId) => {
    const response = await client.get(`/community/${communityId}`);
    return response.data;
};

// [Real Code] - Enabled for MVP
export const createCommunityPost = async (postData) => {
    // Expects: { communityCode, title, content, tags }
    const response = await client.post('/community', postData);
    return response.data;
};

// Add community reaction (code: 1 for like)
export const addCommunityReaction = async (communityId, code = 1) => {
    const response = await client.post(`/community/${communityId}/reaction`, {
        reaction: { code }
    });
    return response.data;
};

// Remove community reaction
export const removeCommunityReaction = async (communityId) => {
    const response = await client.delete(`/community/${communityId}/reaction`);
    return response.data;
};

// Get TIL detail by ID
export const getTilDetail = async (tilId) => {
    const response = await client.get(`/community/${tilId}`);
    return response.data;
};

// Get comments for a TIL post
export const getComments = async (tilId) => {
    const response = await client.get(`/community-posts/${tilId}/comments`);
    return response.data;
};

// Create a comment
export const createComment = async (tilId, content) => {
    const response = await client.post(`/community-posts/${tilId}/comments`, { content });
    return response.data;
};

// Update a comment
export const updateComment = async (commentId, content) => {
    const response = await client.put(`/community-comments/${commentId}`, { content });
    return response.data;
};

// Delete a comment
export const deleteComment = async (commentId) => {
    const response = await client.delete(`/community-comments/${commentId}`);
    return response.data;
};

// Add TIL reaction
export const addTilReaction = async (tilId, type = 0) => {
    const response = await client.post(`/til/${tilId}/reaction`, {
        reaction: { type }
    });
    return response.data;
};

// Remove TIL reaction
export const removeTilReaction = async (tilId) => {
    const response = await client.delete(`/til/${tilId}/reaction`);
    return response.data;
};
