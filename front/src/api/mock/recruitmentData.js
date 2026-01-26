export const mockRecruitments = [
    {
        id: "rec_001",
        company: "Naver",
        title: "2026 Frontend Recruitment",
        position: "Frontend",
        deadline: "2026-02-15T23:59:59Z",
        tags: ["React", "Fresh", "Experienced"],
        isBookmarked: true
    },
    {
        id: "rec_002",
        company: "Toss",
        title: "Product Designer Recruitment",
        position: "Designer",
        deadline: "2026-02-20T23:59:59Z",
        tags: ["UI/UX", "Figma"],
        isBookmarked: false
    }
];

export const mockRecruitmentDetail = {
    ...mockRecruitments[0],
    content: "We are looking for passionate frontend developers...",
    url: "https://recruit.navercorp.com"
};

export const mockProjects = [
    {
        id: "proj_001",
        title: "Portfolio Website",
        description: "My personal portfolio built with React.",
        stack: ["React", "Tailwind"],
        period: "2023.12 - 2024.01"
    }
];
