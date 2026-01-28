import axios from 'axios';
import {
    mockRecruitments,
    mockRecruitmentDetail,
    mockProjects
} from './mock/recruitmentData';

// --- Recruitments ---
export const getRecruitments = async () => {
    return { data: mockRecruitments };
};

export const getRecruitmentDetail = async (id) => {
    return { data: mockRecruitmentDetail };
};

export const getClosingRecruitments = async () => {
    return { data: [mockRecruitments[0]] }; // Return first one as closing soon
};

export const toggleBookmark = async (id) => {
    return { message: "Bookmark toggled" };
};

// --- Projects ---
export const getProjects = async () => {
    return { data: mockProjects };
};
