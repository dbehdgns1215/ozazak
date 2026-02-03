import client from './client';

// --- Cover Letters (자기소개서) ---

// 조회
export const getCoverLetters = async (page = 0, size = 10) => {
    const response = await client.get('/coverletters', {
        params: { page, size }
    });
    return response.data;
};

// 채용공고 기반 자소서 확인 (존재 여부 등)
export const checkCoverLetter = async (recruitmentId) => {
    const response = await client.get('/coverletters/check', {
        params: { recruitmentId }
    });
    return response.data;
};

// 상세 조회
export const getCoverLetterDetail = async (id) => {
    const response = await client.get(`/coverletters/${id}`);
    return response.data;
};

// 수정 (Missing Function 1)
export const updateCoverLetter = async (id, data) => {
    const response = await client.put(`/coverletters/${id}`, data);
    return response.data;
};

// 삭제 (Missing Function 2)
export const deleteCoverLetter = async (id) => {
    const response = await client.delete(`/coverletters/${id}`);
    return response.data;
};

// 질문 조회 (Legacy or Specific)
export const getCoverLetterQuestions = async (id) => {
    const response = await client.get(`/coverletters/${id}`);
    // 필요하다면 여기서 response.data.questions 만 리턴하도록 수정
    return response.data;
};


// --- Essays (문항별 답변) ---

export const updateEssay = async (essayId, content) => {
    // 실제 API 엔드포인트에 맞춰 수정 필요 (예: PUT /essays/:id)
    const response = await client.put(`/essays/${essayId}`, { content });
    return response.data;
};

export const commitEssay = async (essayId, data) => {
    // 실제 API 엔드포인트에 맞춰 수정 필요
    const response = await client.post(`/essays/${essayId}/commit`, data);
    return response.data;
};


// --- Blocks (자소서 블록) ---

// 블록 조회
export const getBlocks = async (page = 0, size = 100) => {
    const response = await client.get('/blocks', {
        params: { page, size }
    });
    return response.data;
};

// [추가] 블록 생성 (Missing Function 3)
export const createBlock = async (blockData) => {
    const response = await client.post('/blocks', blockData);
    return response.data;
};

// [추가] 블록 수정 (Missing Function 4)
export const updateBlock = async (id, blockData) => {
    const response = await client.put(`/blocks/${id}`, blockData);
    return response.data;
};

// [추가] 블록 삭제 (Missing Function 5)
export const deleteBlock = async (id) => {
    const response = await client.delete(`/blocks/${id}`);
    return response.data;
};


// --- AI Generation ---
export const generateAiCoverLetter = async (requestBody) => {
    const response = await client.post('/essays/ai', requestBody);
    return response.data;
};