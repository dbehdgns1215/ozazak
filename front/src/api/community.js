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

export const getCommunityPostDetail = async (postId) => {
    // [Real Code]
    // const response = await axios.get(`/api/community-post/${postId}`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockCommunityPosts[0] }; // Return first post as detail
};

// [Real Code] - Enabled for MVP
export const createCommunityPost = async (postData) => {
    // Expects: { communityCode, title, content, tags }
    const response = await client.post('/api/community', postData);
    return response.data;
};

// --- Comments ---
export const getComments = async (postId) => {
    // [Real Code]
    // const response = await axios.get(`/api/community-posts/${postId}/comments`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockComments };
};

export const createComment = async (postId, content) => {
    // [Real Code]
    // const response = await axios.post(`/api/community-posts/${postId}/comments`, { content });
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { message: "Comment created", id: "new_cmt_id" };
};
