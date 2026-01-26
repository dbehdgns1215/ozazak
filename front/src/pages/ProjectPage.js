import React from 'react';
import { Plus } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'AI 기반 자동 분석 플랫폼',
    period: '2025.01 - 2025.03',
    tags: ['Dev'],
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 2,
    title: '협업 프로젝트 관리 시스템',
    period: '2024.11 - 2024.12',
    tags: ['Dev', 'Design'],
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 3,
    title: '반응형 웹 포트폴리오 사이트',
    period: '2024.09 - 2024.10',
    tags: ['Dev'],
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 4,
    title: '모바일 앱 UI/UX 리디자인',
    period: '2024.07 - 2024.08',
    tags: ['Design'],
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
];

const getTagColor = (tag) => {
    switch(tag) {
        case 'Dev': return 'bg-blue-100 text-blue-800';
        case 'Design': return 'bg-purple-100 text-purple-800';
        default: return 'bg-slate-100 text-slate-800';
    }
}

const ProjectCard = ({ project }) => {
    return (
        <div className="group bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all duration-300">
            <div className="aspect-w-16 aspect-h-9">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="p-4">
                <div className="flex gap-2 mb-2">
                    {project.tags.map(tag => (
                        <span key={tag} className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getTagColor(tag)}`}>
                            {tag}
                        </span>
                    ))}
                </div>
                <h3 className="font-bold text-slate-900 tracking-tight">{project.title}</h3>
                <p className="text-sm text-slate-500">{project.period}</p>
            </div>
        </div>
    )
}

export default function ProjectPage() {
  return (
    <div className="w-full">
        <div className="mb-8">
            <h1 className="text-slate-900 font-bold text-2xl tracking-tight">내 프로젝트</h1>
            <p className="text-slate-600 mt-1">경험과 성과를 기록하고 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
        
        <button className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
            <Plus size={32} />
        </button>
    </div>
  );
}
