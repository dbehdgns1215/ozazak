import axios from 'axios';
import {
    mockRecruitments,
    mockRecruitmentDetail,
    mockProjects
} from './mock/recruitmentData';

const SIMULATED_DELAY = 500;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Recruitments ---
export const getRecruitments = async () => {
    // [Real Code]
    // const response = await axios.get('/api/recruitments');
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockRecruitments };
};

export const getRecruitmentDetail = async (id) => {
    // [Real Code]
    // const response = await axios.get(`/api/recruitments/${id}`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockRecruitmentDetail };
};

export const getClosingRecruitments = async () => {
    // [Real Code]
    // const response = await axios.get('/api/recruitments/closing');
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: [mockRecruitments[0]] }; // Return first one as closing soon
};

export const toggleBookmark = async (id) => {
    // [Real Code]
    // const response = await axios.post(`/api/recruitments/${id}/bookmark`); // or delete based on state
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { message: "Bookmark toggled" };
};

// --- Projects ---
export const getProjects = async () => {
    // [Real Code]
    // const response = await axios.get('/api/projects');
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockProjects };
};
