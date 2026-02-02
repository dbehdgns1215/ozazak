import client from './client';
import {
    mockPastCoverLetters,
    mockUserBlocks,
    mockAiGeneratedText
} from './mock/coverLetterData';

const SIMULATED_DELAY = 500;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getCoverLetters = async (page = 0, size = 10) => {
    const response = await client.get('/coverletters', {
        params: { page, size }
    });
    return response.data;
};

export const checkCoverLetter = async (recruitmentId) => {
    const response = await client.get('/coverletters/check', {
        params: { recruitmentId }
    });
    return response.data;
};

export const getCoverLetterDetail = async (id) => {
    const response = await client.get(`/coverletters/${id}`);
    return response.data;
};

// Deprecated or Mock-only ? Use real API or remove if not used
export const getCoverLetterQuestions = async (id) => {
    // This seems redundant if getCoverLetterDetail returns everything
    // But keeping it compatible if used elsewhere, redirecting to detail
    const response = await client.get(`/coverletters/${id}`);
    // Extract questions if needed, or just return data
    return response.data;
};

// --- Essays (Answers) ---
// If these have real endpoints, update them. For now, keeping as mock or placeholders
// as I don't have instructions on essay endpoints yet, or they are part of updateCoverLetter.

export const updateEssay = async (essayId, content) => {
    // Placeholder for real API
    console.log(`[API] Update essay ${essayId}: ${content}`);
    return { message: "Essay saved (local)" };
};

export const commitEssay = async (essayId, data) => {
    // Placeholder for real API
    console.log(`[API] Commit essay ${essayId}:`, data);
    return { message: "Essay version committed" };
};

// --- Blocks ---
export const getBlocks = async (page = 0, size = 100) => {
    const response = await client.get('/blocks', {
        params: { page, size }
    });
    return response.data;
};

// --- AI Generation ---
export const generateAiCoverLetter = async (requestBody) => {
    // requestBody should match AIGenerateEssayRequest structure
    // Backend: /api/essays/ai (Class: /api/essays, Method: /ai)
    const response = await client.post('/essays/ai', requestBody);
    return response.data;
};