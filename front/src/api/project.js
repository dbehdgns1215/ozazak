import client from './client';

// Mock Data for Projects (can be moved to mock/projectData.js later if needed)
const MOCK_STORAGE_KEY = 'mock_projects';

// Default Mocks
const defaultMocks = [
    { id: 1, title: 'AI 자소서 도우미', description: '생성형 AI를 활용한 자소서 작성 보조 서비스', techStack: ['React', 'Python', 'FastAPI'], role: 'Frontend', period: '2024.12 - 2025.01', thumbnailUrl: '', startedAt: '2024-12-01', endedAt: '2025-01-31' },
    { id: 2, title: '싸피복지몰', description: '교육생 전용 복지몰 프로젝트', techStack: ['Vue.js', 'Spring Boot'], role: 'Fullstack', period: '2024.06 - 2024.08', thumbnailUrl: '', startedAt: '2024-06-01', endedAt: '2024-08-31' },
];

// Helper to get mocks
const getMockData = () => {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultMocks;
};

// Helper to save mocks
const saveMockData = (data) => {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
};

// Toggle: Defaults to false (Real API) unless env var is explicitly 'true'
const USE_MOCK = process.env.REACT_APP_USE_MOCK_PROJECT_API === 'true'; 

const SIMULATED_DELAY = 500;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Mock Impl ---
const createProjectMock = async (payload) => {
    await delay(SIMULATED_DELAY);
    const mocks = getMockData();
    const newId = mocks.length > 0 ? Math.max(...mocks.map(p => p.id)) + 1 : 1;
    const newProject = {
        id: newId,
        ...payload,
        techStack: payload.tags, 
        period: `${payload.startedAt} - ${payload.endedAt || 'Present'}`
    };
    mocks.push(newProject);
    saveMockData(mocks);
    return { data: { projectId: newId } };
};

const updateProjectMock = async (projectId, payload) => {
    await delay(SIMULATED_DELAY);
    const mocks = getMockData();
    const index = mocks.findIndex(p => p.id === Number(projectId));
    
    if (index === -1) throw new Error("Project not found");
    
    const updated = {
        ...mocks[index],
        ...payload,
        techStack: payload.tags,
        period: `${payload.startedAt} - ${payload.endedAt || 'Present'}`
    };
    
    mocks[index] = updated;
    saveMockData(mocks);
    return { data: { projectId: Number(projectId) } };
};

const getProjectsMock = async (page = 0, size = 9) => {
    await delay(SIMULATED_DELAY);
    const all = getMockData();
    // Simulate pagination for mock
    const start = page * size;
    const end = start + size;
    const contents = all.slice(start, end);
    return {
        data: {
            contents,
            pageInfo: {
                currentPage: page,
                totalPages: Math.ceil(all.length / size),
                totalElements: all.length,
                hasNext: end < all.length
            }
        }
    };
};

const getProjectMock = async (projectId) => {
    await delay(SIMULATED_DELAY);
    const mocks = getMockData();
    const project = mocks.find(p => p.id === Number(projectId));
    if (!project) throw new Error("Project not found in mock data");
    return { data: project };
};

const deleteProjectMock = async (projectId) => {
    await delay(SIMULATED_DELAY);
    const mocks = getMockData();
    const filtered = mocks.filter(p => p.id !== Number(projectId));
    if (filtered.length === mocks.length) throw new Error("Project not found");
    saveMockData(filtered);
    return { success: true };
};

// --- Real Impl ---
const getConfig = () => {
    const token = process.env.REACT_APP_ACCESS_TOKEN;
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        }
    };
};

const createProjectReal = async (payload) => {
    const response = await client.post('/api/projects', payload, getConfig());
    return response.data;
};

const updateProjectReal = async (projectId, payload) => {
    const response = await client.put(`/api/projects/${projectId}`, payload, getConfig());
    return response.data;
};

const getProjectsReal = async (page = 0, size = 9) => {
    const response = await client.get(`/api/projects?page=${page}&size=${size}`, getConfig());
    return response.data;
};

const getProjectReal = async (projectId) => {
    const response = await client.get(`/api/projects/${projectId}`, getConfig());
    return response.data;
};

const deleteProjectReal = async (projectId) => {
    const response = await client.delete(`/api/projects/${projectId}`, getConfig());
    return response.data;
};

// --- Exported Functions ---
export const createProject = USE_MOCK ? createProjectMock : createProjectReal;
export const updateProject = USE_MOCK ? updateProjectMock : updateProjectReal;
export const getProjects = USE_MOCK ? getProjectsMock : getProjectsReal;
export const getProject = USE_MOCK ? getProjectMock : getProjectReal;
export const deleteProject = USE_MOCK ? deleteProjectMock : deleteProjectReal;
