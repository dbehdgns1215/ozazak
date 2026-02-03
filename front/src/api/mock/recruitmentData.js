export const mockRecruitments = [
    {
        id: "rec_001",
        company: "Naver",
        title: "2026 Frontend Recruitment",
        position: "Frontend",
        deadline: "2026-02-15T23:59:59Z",
        tags: ["React", "Fresh", "Experienced"],
        isBookmarked: true,
        dDay: 18,
        address: "1784, Jeongja-dong, Bundang-gu, Seongnam-si, Gyeonggi-do",
        posterImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
        workplaceInfo: "Bundang Headquarters",
        description: "We are looking for a passionate Frontend Developer to join our team. You will responsible for building high-quality web applications."
    },
    {
        id: "rec_002",
        company: "Toss",
        title: "Product Designer Recruitment",
        position: "Designer",
        deadline: "2026-02-20T23:59:59Z",
        tags: ["UI/UX", "Figma"],
        isBookmarked: false,
        dDay: 23,
        address: "Yeoksam-dong, Gangnam-gu, Seoul",
        posterImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
        workplaceInfo: "Gangnam Arc Place",
        description: "Join Toss and design the future of finance. We need someone who is obsessed with user experience."
    },
    {
        id: "rec_003",
        company: "Kakao",
        title: "Backend Engineer (Server)",
        position: "Backend",
        deadline: "2026-03-01T23:59:59Z",
        tags: ["Spring Boot", "Kotlin", "Java"],
        isBookmarked: false,
        dDay: 32,
        address: "Pangyo, Seongnam-si, Gyeonggi-do",
        posterImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80",
        workplaceInfo: "Kakao Agit",
        description: "Scale our backend systems to support millions of users. Experience with distributed systems is a plus."
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
        description: "My personal portfolio built with React and Framer Motion.",
        role: "Frontend Developer",
        stack: ["React", "Tailwind"],
        techStack: ["React", "Tailwind", "Framer Motion", "Vite"],
        period: "2023.12 - 2024.01",
        content: "Detailed content about how I built this portfolio...",
        images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"],
        teamSize: 1
    },
    {
        id: "proj_002",
        title: "Scripter - AI Cover Letter Helper",
        description: "AI-powered service to help job seekers write cover letters.",
        role: "Full Stack Developer",
        stack: ["Next.js", "OpenAI"],
        techStack: ["Next.js", "TypeScript", "Tailwind", "OpenAI API"],
        period: "2024.01 - Present",
        content: "Scripter helps users generate cover letters based on their resume...",
        images: ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80"],
        teamSize: 4
    }
];
