export const BLOCK_CATEGORY_MAP: Record<number, string> = {
    0: '성장과정, 가치관',
    1: '성격의 장점',
    2: '성격의 단점 및 극복',
    3: '팀워크, 협업',
    4: '갈등 해결',
    5: '리더십, 주도성',
    6: '의사소통 능력',
    7: '기술적 문제 해결',
    8: '성능 최적화, 개선',
    9: '신기술 습득, 학습 능력',
    10: '설계 및 아키텍처',
    11: '도전, 실패 극복',
    12: '지원 동기',
    13: '입사 후 포부',
    14: '관심 분야, 트렌드 분석'
};

export interface BlockCategory {
    code: number;
    name: string;
}

export const BLOCK_CATEGORY_LIST: BlockCategory[] = Object.entries(BLOCK_CATEGORY_MAP).map(([code, name]) => ({
    code: parseInt(code),
    name: name as string
}));
