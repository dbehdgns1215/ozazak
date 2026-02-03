export const mockTilData = {
    items: [
        {
            id: 1,
            title: "React Hooks 완벽 정리",
            content: "오늘은 React Hooks에 대해 깊이 공부했습니다. useState, useEffect, useContext 등 다양한 훅들의 사용법과 실전 예제를 정리했습니다. 특히 useEffect의 의존성 배열 관리가 중요하다는 것을 배웠습니다.",
            author: {
                name: "김싸피",
                img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kim",
                companyName: "삼성전자"
            },
            tags: ["React", "JavaScript", "Hooks"],
            reactions: 42,
            view: 234,
            commentCount: 8,
            createdAt: "2026-01-28T10:30:00Z"
        },
        {
            id: 2,
            title: "TypeScript 제네릭 활용하기",
            content: "TypeScript의 제네릭을 사용하여 재사용 가능한 컴포넌트를 만드는 방법을 학습했습니다. 타입 안정성을 유지하면서도 유연한 코드를 작성할 수 있었습니다.",
            author: {
                name: "박개발",
                img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Park",
                companyName: "카카오"
            },
            tags: ["TypeScript", "Generic", "Programming"],
            reactions: 56,
            view: 189,
            commentCount: 12,
            createdAt: "2026-01-27T15:20:00Z"
        },
        {
            id: 3,
            title: "Spring Boot JPA N+1 문제 해결",
            content: "JPA 사용 시 발생하는 N+1 문제를 해결하는 여러 방법을 실습했습니다. fetch join, @EntityGraph, batch size 설정 등 다양한 해결책을 비교 분석했습니다.",
            author: {
                name: "이백엔드",
                img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lee",
                companyName: "네이버"
            },
            tags: ["Spring", "JPA", "Database"],
            reactions: 78,
            view: 456,
            commentCount: 15,
            createdAt: "2026-01-26T09:15:00Z"
        },
        {
            id: 4,
            title: "Docker Compose로 개발 환경 구축",
            content: "Docker Compose를 활용하여 프론트엔드, 백엔드, 데이터베이스를 한 번에 실행하는 개발 환경을 구축했습니다. 팀원들과 동일한 환경에서 작업할 수 있어 편리합니다.",
            author: {
                name: "최인프라",
                img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Choi",
                companyName: "라인"
            },
            tags: ["Docker", "DevOps", "Infrastructure"],
            reactions: 91,
            view: 512,
            commentCount: 20,
            createdAt: "2026-01-25T14:45:00Z"
        },
        {
            id: 5,
            title: "알고리즘 - 이진 탐색 트리 구현",
            content: "이진 탐색 트리(BST)를 JavaScript로 직접 구현해봤습니다. 삽입, 삭제, 탐색 연산의 시간 복잡도를 분석하고 균형 잡힌 트리의 중요성을 이해했습니다.",
            author: {
                name: "정알고",
                img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jung",
                companyName: "쿠팡"
            },
            tags: ["Algorithm", "DataStructure", "JavaScript"],
            reactions: 35,
            view: 178,
            commentCount: 6,
            createdAt: "2026-01-24T11:30:00Z"
        },
        {
            id: 6,
            title: "CSS Grid vs Flexbox 비교",
            content: "CSS Grid와 Flexbox의 차이점을 실습을 통해 비교했습니다. 각각의 장단점과 사용 사례를 정리하여 적재적소에 활용할 수 있도록 학습했습니다.",
            author: {
                name: "한프론트",
                img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Han",
                companyName: "토스"
            },
            tags: ["CSS", "Layout", "Frontend"],
            reactions: 67,
            view: 345,
            commentCount: 11,
            createdAt: "2026-01-23T16:00:00Z"
        },
        {
            id: 7,
            title: "REST API 설계 원칙",
            content: "RESTful API 설계의 모범 사례를 학습했습니다. 리소스 중심 설계, HTTP 메서드의 올바른 사용, 상태 코드 활용 등을 정리했습니다.",
            author: {
                name: "윤아키",
                img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yoon",
                companyName: "우아한형제들"
            },
            tags: ["API", "REST", "Backend"],
            reactions: 83,
            view: 421,
            commentCount: 18,
            createdAt: "2026-01-22T13:20:00Z"
        },
        {
            id: 8,
            title: "Git Rebase vs Merge 이해하기",
            content: "Git의 rebase와 merge의 차이점을 실습했습니다. 각각의 사용 시나리오와 주의사항을 정리하여 협업 시 올바른 선택을 할 수 있도록 학습했습니다.",
            author: {
                name: "강협업",
                img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kang",
                companyName: "당근마켓"
            },
            tags: ["Git", "VersionControl", "Collaboration"],
            reactions: 49,
            view: 267,
            commentCount: 9,
            createdAt: "2026-01-21T10:10:00Z"
        },
        {
            id: 9,
            title: "SOLID 원칙 실전 적용",
            content: "객체지향 설계의 SOLID 원칙을 실제 프로젝트에 적용해봤습니다. 단일 책임, 개방-폐쇄, 리스코프 치환, 인터페이스 분리, 의존성 역전 원칙을 코드로 구현했습니다.",
            author: {
                name: "서설계",
                img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seo",
                companyName: "야놀자"
            },
            tags: ["OOP", "Design", "Architecture"],
            reactions: 102,
            view: 589,
            commentCount: 24,
            createdAt: "2026-01-20T14:30:00Z"
        },
        {
            id: 10,
            title: "웹 성능 최적화 기법",
            content: "웹 애플리케이션의 성능을 최적화하는 다양한 기법을 학습했습니다. 이미지 lazy loading, 코드 splitting, 캐싱 전략 등을 실습했습니다.",
            author: {
                name: "노최적",
                img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noh",
                companyName: "번개장터"
            },
            tags: ["Performance", "Optimization", "Web"],
            reactions: 71,
            view: 398,
            commentCount: 13,
            createdAt: "2026-01-19T09:45:00Z"
        }
    ],
    pageInfo: {
        currentPage: 1,
        pageSize: 10,
        totalElements: 10,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false
    }
};
