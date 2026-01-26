import axios from 'axios';
import {
    mockCoverLetters,
    mockCoverLetterQuestions,
    mockEssays,
    mockBlocks
} from './mock/coverLetterData';

const SIMULATED_DELAY = 500;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getCoverLetters = async () => {
    // [Real Code]
    // const response = await axios.get('/api/cover-letters/originals');
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockCoverLetters };
};

export const getCoverLetterDetail = async (id) => {
    // [Real Code]
    // const response = await axios.get(`/api/cover-letters/originals/${id}`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockCoverLetters[0] };
};

export const getCoverLetterQuestions = async (id) => {
    // [Real Code]
    // const response = await axios.get(`/api/cover-letters/questions/${id}`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockCoverLetterQuestions };
};

// --- Essays (Answers) ---
export const updateEssay = async (essayId, content) => {
    // [Real Code]
    // const response = await axios.put(`/api/cover-letters/originals/essay/${essayId}`, { content });
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { message: "Essay saved (temp)" };
};

export const commitEssay = async (essayId, data) => {
    // [Real Code]
    // const response = await axios.post(`/api/cover-letters/originals/essay/${essayId}`, data);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { message: "Essay version committed" };
};

// --- Blocks ---
export const getBlocks = async () => {
    // [Real Code]
    // const response = await axios.get('/api/cover-letters/blocks');
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockBlocks };
};
