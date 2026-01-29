import axios from 'axios';
import {
    mockPastCoverLetters,
    mockUserBlocks,
    mockAiGeneratedText
} from './mock/coverLetterData';

const SIMULATED_DELAY = 500;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getCoverLetters = async () => {
    await delay(SIMULATED_DELAY);
    // Return a simplified list for the "자소서" tab
    const simplifiedCoverLetters = mockPastCoverLetters.map(cl => ({
        id: cl.id,
        company: cl.company,
        role: cl.role,
        date: cl.date,
        // status and updatedAt are not in the new mock, so we omit them or mock them
        status: 'COMPLETED', // default to completed for mock
        updatedAt: new Date().toISOString() // mock current date
    }));
    return { data: simplifiedCoverLetters };
};

export const getCoverLetterDetail = async (id) => {
    await delay(SIMULATED_DELAY);
    const coverLetter = mockPastCoverLetters.find(cl => cl.id === id);
    if (!coverLetter) {
        throw new Error('Cover letter not found');
    }
    // For detail, we return the full cover letter with questions
    return { data: coverLetter };
};

export const getCoverLetterQuestions = async (id) => {
    await delay(SIMULATED_DELAY);
    const coverLetter = mockPastCoverLetters.find(cl => cl.id === id);
    if (!coverLetter) {
        throw new Error('Cover letter not found');
    }
    // Extract only questions for the questions panel
    const questions = coverLetter.questions.map((q, index) => ({
        id: `q${index + 1}`,
        content: q.q,
        limit: 1000 // Mock limit
    }));
    return { data: questions };
};


// --- Essays (Answers) - These functions might need re-evaluation based on new structure ---
// For now, these functions will remain as is, assuming a future integration where
// essays are managed separately or within the coverLetter structure.
export const updateEssay = async (essayId, content) => {
    await delay(SIMULATED_DELAY);
    console.log(`Mock: Updated essay ${essayId} with content: ${content}`);
    return { message: "Essay saved (temp)" };
};

export const commitEssay = async (essayId, data) => {
    await delay(SIMULATED_DELAY);
    console.log(`Mock: Committed essay ${essayId} with data:`, data);
    return { message: "Essay version committed" };
};

// --- Blocks ---
export const getBlocks = async () => {
    await delay(SIMULATED_DELAY);
    return { data: mockUserBlocks };
};

// --- AI Generation ---
export const generateAiCoverLetter = async (blockContent, questionContent) => {
    await delay(SIMULATED_DELAY * 2); // Longer delay for AI generation
    const generatedText = mockAiGeneratedText(blockContent, questionContent);
    return { data: generatedText };
};