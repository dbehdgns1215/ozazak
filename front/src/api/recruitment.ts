import client from './client';

// ============================================
// 마감 직전 공고 (Closing Jobs) Interfaces
// ============================================
export interface ClosingJobItem {
    recruitmentId: number;
    companyName: string;    // 회사명 (Card Title)
    companyImg: string;     // 회사 로고 URL (Logo Image)
    position: string[];     // 직무 배열 (예: ["Backend", "Java"])
    title: string;          // 공고 제목
    endDate: string;        // 마감일
    dDay: number;           // 마감 D-Day (Badge)
    isBookmarked: boolean;  // 북마크 여부
}

// ============================================
// 기존 Recruitment Interfaces
// ============================================
export interface Recruitment {
    id: number;
    company: string;
    title: string;
    deadline: string;
    dDay: number;
    jobRole: string;
    url: string;
}

// ============================================
// API Functions
// ============================================

// 목록 조회
export const getRecruitments = async (params?: any) => {
    const response = await client.get('/recruitments', { params });
    return { data: response.data.map((item: any) => item.data) };
};

// 상세 조회
export const getRecruitmentDetail = async (id: number | string) => {
    const response = await client.get(`/recruitments/${id}`);
    return { data: response.data.data };
};

// 북마크 추가
export const addBookmark = async (id: number) => {
    return client.post(`/recruitments/${id}/bookmark`);
};

// 북마크 삭제
export const deleteBookmark = async (id: number) => {
    return client.delete(`/recruitments/${id}/bookmark`);
};

// 마감 임박 공고 (✨ Updated for new API spec & Deduplication)
export const getClosingRecruitments = async () => {
    const response = await client.get('/recruitments/closing');

    // 1. 데이터 매핑 (기존 로직 유지)
    const parsedItems = (response.data || []).map((item: any) => {
        const jobData = item.data || item;
        return {
            recruitmentId: jobData.recruitmentId,
            companyName: jobData.companyName,
            companyImg: jobData.companyImage || '',
            position: jobData.position || [jobData.title || ''],
            title: jobData.title || '',
            endDate: jobData.endedAt || '',
            dDay: jobData.dDay ?? 0,  // ✅ 백엔드 필드명: dDay (대문자 D)
            isBookmarked: jobData.isBookmarked || false  // ✅ 백엔드 필드명: isBookmarked
        };
    });

    // 2. 회사명 기준 중복 제거
    const uniqueItems: ClosingJobItem[] = [];
    const seenCompanies = new Set();

    parsedItems.forEach((item: ClosingJobItem) => {
        if (!seenCompanies.has(item.companyName)) {
            seenCompanies.add(item.companyName);
            uniqueItems.push(item);
        }
    });

    return { data: uniqueItems };
};

// 북마크 목록
export const getBookmarkedRecruitments = async (params?: any) => {
    const response = await client.get('/recruitments/bookmark', { params });
    return { data: response.data.map((item: any) => item.data) };
};
