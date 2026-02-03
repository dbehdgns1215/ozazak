
const SIMULATED_DELAY = 500;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_PROJECTS = [
    { id: 101, name: 'S14 페이먼트 시스템', description: 'MSA 기반의 결제 시스템 구축 프로젝트. Spring Boot와 Kafka를 활용하여 트랜잭션 처리량을 2배 증대시켰습니다.', date: '2023.10' },
    { id: 102, name: '사내 챗봇 서비스', description: 'RAG 기반의 사내 문서 검색 및 Q&A 챗봇. Python, LangChain, OpenAI API 활용.', date: '2023.12' },
    { id: 103, name: 'OjaJak 프론트엔드', description: '취업 준비생을 위한 올인원 플랫폼. React, TypeScript, Tailwind CSS 사용.', date: '2024.01' },
    { id: 104, name: 'Smart Home IoT', description: 'Raspberry Pi와 Zigbee를 이용한 스마트 홈 제어 시스템.', date: '2023.05' },
    { id: 105, name: 'Algorithmic Trading Bot', description: 'Binance API를 활용한 자동 매매 봇. 수익률 5% 달성.', date: '2023.02' }
];

export const getProjects = async (page = 1, size = 10) => {
    await delay(SIMULATED_DELAY);
    // Mock pagination logic could be added here if needed, for now just return all/list
    return { content: MOCK_PROJECTS, totalPages: 1 };
};

export const getProject = async (id) => {
    await delay(SIMULATED_DELAY);
    const project = MOCK_PROJECTS.find(p => p.id === parseInt(id));
    return { data: project };
};

export const createProject = async (data) => {
    await delay(SIMULATED_DELAY);
    console.log("Mock: Created project", data);
    return { data: { ...data, id: Date.now() } };
};

export const updateProject = async (id, data) => {
    await delay(SIMULATED_DELAY);
    console.log(`Mock: Updated project ${id}`, data);
    return { data: { ...data, id } };
};

export const deleteProject = async (id) => {
    await delay(SIMULATED_DELAY);
    console.log(`Mock: Deleted project ${id}`);
    return { success: true };
};
