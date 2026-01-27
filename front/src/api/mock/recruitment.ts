export interface Recruitment {
    id: number;
    company: string;
    title: string;
    deadline: string;
    dDay: number;
    jobRole: string;
    url: string;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    techStack: string[];
    role: string;
    period: string;
}

export const recruitmentApi = {
    // Recruitments
    getAll: async (): Promise<Recruitment[]> => new Promise(r => setTimeout(() => r([
        { id: 1, company: '당근', title: '서버 개발자 윈터테크 인턴', deadline: '2025-02-10', dDay: 14, jobRole: 'Backend', url: '#' },
        { id: 2, company: '우아한형제들', title: '웹프론트엔드 경력 채용', deadline: '2025-02-05', dDay: 9, jobRole: 'Frontend', url: '#' },
        { id: 3, company: '쿠팡', title: 'Product Designer', deadline: '2025-01-30', dDay: 3, jobRole: 'Design', url: '#' },
    ]), 500)),

    getClosing: async (): Promise<Recruitment[]> => new Promise(r => setTimeout(() => r([
        { id: 3, company: '쿠팡', title: 'Product Designer', deadline: '2025-01-30', dDay: 3, jobRole: 'Design', url: '#' },
        { id: 4, company: '직방', title: 'AI Engineer', deadline: '2025-01-28', dDay: 1, jobRole: 'AI', url: '#' },
    ]), 500)),

    bookmark: {
        add: async (id: number) => new Promise(r => setTimeout(() => r({ success: true }), 500)),
        remove: async (id: number) => new Promise(r => setTimeout(() => r({ success: true }), 500)),
    },

    // Projects
    getProjects: async (): Promise<Project[]> => new Promise(r => setTimeout(() => r([
        { id: 1, title: 'AI 자소서 도우미', description: '생성형 AI를 활용한 자소서 작성 보조 서비스', techStack: ['React', 'Python', 'FastAPI'], role: 'Frontend', period: '2024.12 - 2025.01' },
        { id: 2, title: '싸피복지몰', description: '교육생 전용 복지몰 프로젝트', techStack: ['Vue.js', 'Spring Boot'], role: 'Fullstack', period: '2024.06 - 2024.08' },
    ]), 500)),

    createProject: async (data: any) => new Promise(r => setTimeout(() => r({ id: Math.random(), ...data }), 500)),
    deleteProject: async (id: number) => new Promise(r => setTimeout(() => r(true), 500)),
};
