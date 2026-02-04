import client from './client';

// --- Cover Letters (자기소개서) ---

// 조회
export const getCoverLetters = async (page = 0, size = 10) => {
    const response = await client.get('/coverletters', {
        params: { page, size }
    });
    // Normalized response handling for different callers
    const items = response.data?.data?.items || response.data?.items || response.data;
    const safeItems = Array.isArray(items) ? items : [];
    return {
        data: safeItems,
        items: safeItems,
        pageInfo: response.data?.data?.pageInfo || response.data?.pageInfo
    };
};

// 채용공고 기반 자소서 확인 (존재 여부 등)
export const checkCoverLetter = async (recruitmentId) => {
    const response = await client.get('/coverletters/check', {
        params: { recruitmentId }
    });
    return response.data;
};

// 생성
export const createCoverLetter = async (data) => {
    const response = await client.post('/coverletters', data);
    return response.data;
};

// 상세 조회
export const getCoverLetterDetail = async (id) => {
    const response = await client.get(`/coverletters/${id}`);
    // Return wrapped in data for compatibility with destructuring { data } in callers
    return { data: response.data.data || response.data };
};

// 수정
export const updateCoverLetter = async (id, data) => {
    const response = await client.put(`/coverletters/${id}`, data);
    return response.data;
};

// 삭제
export const deleteCoverLetter = async (id) => {
    const response = await client.delete(`/coverletters/${id}`);
    return response.data;
};

// 질문 조회 (Legacy or Specific)
export const getCoverLetterQuestions = async (id) => {
    const response = await client.get(`/coverletters/${id}`);
    return response.data;
};


// --- Essays (문항별 답변) ---

export const updateEssay = async (essayId, content, versionTitle) => {
    const body = { content };
    if (versionTitle !== undefined) body.versionTitle = versionTitle;
    const response = await client.put(`/essays/${essayId}`, body);
    return response.data;
};

export const deleteEssay = async (essayId) => {
    const response = await client.delete(`/essays/${essayId}`);
    return response.data;
};

// 새 버전 생성
export const createEssayVersion = async (baseEssayId, content) => {
    const response = await client.post(`/essays/${baseEssayId}/versions`, {
        content
    });
    return { data: response.data.data || response.data };
};

// 현재 버전 설정
export const setCurrentEssay = async (targetEssayId, previousCurrentEssayId) => {
    const response = await client.put(`/essays/${targetEssayId}/current`, {
        previousCurrentEssayId
    });
    return response.data;
};

export const commitEssay = async (essayId, data) => {
    const response = await client.post(`/essays/${essayId}/commit`, data);
    return response.data;
};


// --- Blocks (자소서 블록) ---

// 블록 조회
export const getBlocks = async (page = 0, size = 100) => {
    const response = await client.get('/blocks', {
        params: { page, size }
    });
    const data = response.data?.data || response.data;
    const items = data.items || data.blocks || (Array.isArray(data) ? data : []);

    return {
        data: items,
        items: items,
        blocks: items
    };
};

export const createBlock = async (blockData) => {
    const response = await client.post('/blocks', blockData);
    return response.data;
};

export const updateBlock = async (id, blockData) => {
    const response = await client.put(`/blocks/${id}`, blockData);
    return response.data;
};

export const deleteBlock = async (id) => {
    const response = await client.delete(`/blocks/${id}`);
    return response.data;
};


// --- AI Generation ---
export const generateAiCoverLetter = async (requestBody) => {
    const response = await client.post('/essays/ai', requestBody);
    return response.data;
};