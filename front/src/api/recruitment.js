import client from './client';

// 목록 조회
export const getRecruitments = async (params) => {
    const response = await client.get('/recruitments', { params });
    return { data: response.data.map(item => item.data) };
};

// 상세 조회
export const getRecruitmentDetail = async (id) => {
    const response = await client.get(`/recruitments/${id}`);
    return { data: response.data.data };
};

// 북마크 추가
export const addBookmark = async (id) => {
    return client.post(`/recruitments/${id}/bookmark`);
};

// 북마크 삭제
export const deleteBookmark = async (id) => {
    return client.delete(`/recruitments/${id}/bookmark`);
};

// 마감 임박 공고
export const getClosingRecruitments = async () => {
    const response = await client.get('/recruitments/closing');
    return { data: response.data.map(item => item.data) };
};

// 북마크 목록
export const getBookmarkedRecruitments = async () => {
    const response = await client.get('/recruitments/bookmark');
    return { data: response.data.map(item => item.data) };
};
