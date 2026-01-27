export interface CoverLetter {
    id: number;
    title: string;
    targetCompany: string;
    targetRole: string;
    status: 'draft' | 'completed';
    updatedAt: string;
}

export const coverLetterApi = {
    getAll: async (): Promise<CoverLetter[]> => new Promise(r => setTimeout(() => r([
        { id: 1, title: '2025 상반기 네이버 공채', targetCompany: '네이버', targetRole: 'Frontend', status: 'completed', updatedAt: '2025-01-20' },
        { id: 2, title: '토스 NEXT 개발자', targetCompany: '비바리퍼블리카', targetRole: 'Frontend', status: 'draft', updatedAt: '2025-01-25' },
    ]), 500)),

    getById: async (id: number) => new Promise(r => setTimeout(() => r({
        id, title: 'Detailed Cover Letter', questions: [
            { id: 1, question: '지원 동기', content: '제가 지원한 이유는...' },
            { id: 2, question: '장단점', content: '저의 장점은 끈기입니다.' }
        ]
    }), 500)),

    saveDraft: async (id: number, data: any) => new Promise(r => setTimeout(() => r({ success: true }), 500)),
    commitVersion: async (id: number, message: string) => new Promise(r => setTimeout(() => r({ success: true }), 500)),
    delete: async (id: number) => new Promise(r => setTimeout(() => r(true), 500)),

    // Blocks
    getBlocks: async () => new Promise(r => setTimeout(() => r([
        { id: 1, category: 'Teamwork', content: '팀원과의 갈등을 해결한 경험...' },
        { id: 2, category: 'Growth', content: '새로운 기술을 학습한 방법...' }
    ]), 500))
};
