import client from './client';

// Real API implementations
export const createProject = async (payload) => {
    const response = await client.post('/projects', payload);
    return response.data;
};

export const updateProject = async (projectId, payload) => {
    const response = await client.put(`/projects/${projectId}`, payload);
    return response.data;
};

export const getProjects = async (page = 0, size = 9) => {
    const response = await client.get(`/projects?page=${page}&size=${size}`);
    return response.data;
};

export const getProject = async (projectId) => {
    const response = await client.get(`/projects/${projectId}`);
    return response.data;
};

export const deleteProject = async (projectId) => {
    const response = await client.delete(`/projects/${projectId}`);
    return response.data;
};
