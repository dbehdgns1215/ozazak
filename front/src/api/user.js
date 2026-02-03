import axios from 'axios';
import {
    mockUserProfile,
    mockUserStreak,
    mockRecords,
    mockAwards,
    mockCertifications,
    mockAppliers,
    mockFollowers
} from './mock/userData';

const SIMULATED_DELAY = 500; // ms
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- User Profile ---
export const getUserProfile = async (userId) => {
    // Real API call to UserInfoController
    const response = await axios.get(`/api/users/${userId}`);
    return response.data;
};

export const updateUserProfile = async (userId, data) => {
    // [Real Code]
    // const response = await axios.put(`/api/users/${userId}`, data);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: { ...mockUserProfile, ...data } };
};

export const withdrawUser = async (userId) => {
    // [Real Code]
    // const response = await axios.delete(`/api/users/${userId}`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { message: "User withdrawn successfully" };
};

// --- Streak ---
export const getUserStreak = async (userId) => {
    // [Real Code]
    // const response = await axios.get(`/api/users/${userId}/streak`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockUserStreak };
};

// --- Records ---
export const getUserRecords = async (userId) => {
    // [Real Code]
    // const response = await axios.get(`/api/users/${userId}/record`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockRecords };
};

export const createUserRecord = async (userId, recordData) => {
    // [Real Code]
    // const response = await axios.post(`/api/users/${userId}/record`, recordData);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { message: "Record created", id: "new_rec_id" };
};

// --- Awards ---
export const getUserAwards = async (userId) => {
    // [Real Code]
    // const response = await axios.get(`/api/users/${userId}/award`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockAwards };
};

// --- Certifications ---
export const getUserCertifications = async (userId) => {
    // [Real Code]
    // const response = await axios.get(`/api/users/${userId}/certification`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockCertifications };
};

// --- Appliers (Applications) ---
export const getUserAppliers = async (userId) => {
    // [Real Code]
    // const response = await axios.get(`/api/users/${userId}/applier`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockAppliers };
};

// --- Followers/Followings ---
export const getFollowers = async (userId) => {
    // [Real Code]
    // const response = await axios.get(`/api/users/${userId}/follower`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { data: mockFollowers };
};

export const followUser = async (userId) => {
    // [Real Code]
    // const response = await axios.post(`/api/users/${userId}/follower`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { message: "Followed successfully" };
};

export const unfollowUser = async (userId) => {
    // [Real Code]
    // const response = await axios.delete(`/api/users/${userId}/follower`);
    // return response.data;

    await delay(SIMULATED_DELAY);
    return { message: "Unfollowed successfully" };
};
