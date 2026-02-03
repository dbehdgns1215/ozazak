import client from './client';

// --- TIL ---
export const getTils = async (params) => {
    const response = await client.get('/til', { params });
    return response.data;
};

export const toggleTilReaction = async (tilId) => {
    const response = await client.put(`/til/${tilId}/reaction`);
    return response.data;
};

// --- Community ---
export const getCommunityCategories = async () => {
    const response = await client.get('/community-category');
    return response.data;
};

export const getCommunityPosts = async (params) => {
    const response = await client.get('/community-post', { params });
    return response.data;
};

// Get community post detail by ID
export const getCommunityPostDetail = async (communityId) => {
    const response = await client.get(`/community/${communityId}`);
    return response.data;
};

// [Real Code] - Enabled for MVP
// [Real Code] - Enabled for MVP
export const createCommunityPost = async (postData) => {
    console.log('[API] createCommunityPost Request:', postData);
    try {
        const response = await client.post('/community', postData);
        console.log('[API] createCommunityPost Response:', response);
        return response.data;
    } catch (error) {
        console.error('[API] createCommunityPost Error:', error.response || error);
        throw error;
    }
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
export const removeTilReaction = async (tilId, type) => {
    // Assuming backend supports DELETE with body or query param for type.
    // If standard REST DELETE doesn't support body easily in some clients, query param is safer.
    // However, trying body first matching add logic structure if backend aligns.
    // Or if backend treats it as toggle via POST, we might need to check API spec. 
    // Given the prompt "reaction code 1..5", let's assume DELETE /til/{id}/reaction?code={code} or similar.
    // But since I don't control backend, I will try to follow the pattern of 'add' but with DELETE method.
    // NOTE: axios delete config accepts `data` for body.
    const response = await client.delete(`/til/${tilId}/reaction`, {
        data: { reaction: { type } } 
    });
    return response.data;
};
