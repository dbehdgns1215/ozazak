 import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../api/project';
import { Project } from '../api/mock/recruitment'; // Keeping Type definition
import { FolderGit2, Code2, Calendar, ChevronRight, Plus } from 'lucide-react';

const ProjectPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                console.log("Projects API Response:", response);
                let projectList = [];
                if (Array.isArray(response)) {
                    projectList = response;
                } else if (response && Array.isArray(response.data)) {
                    projectList = response.data;
                } else if (response && Array.isArray(response.list)) {
                    projectList = response.list;
                } else {
                    console.warn("Unexpected API response format:", response);
                }
                setProjects(projectList);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            MY PROJECTS
                        </h1>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            진행했던 프로젝트들을 기록하고 성과를 관리하세요.
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate('/projects/write')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                    >
                        <Plus className="w-5 h-5" /> 새 프로젝트
                    </button>
                </div>

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="group relative glass-dark rounded-3xl p-8 hover:bg-slate-800/40 transition-all cursor-pointer border border-white/5 hover:border-blue-500/30 overflow-hidden"
                        >
                            {/* Hover Glow Effect */}
                            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:scale-110 transition-transform">
                                        <FolderGit2 className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium text-slate-400 border border-slate-700">
                                        {project.role}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-slate-400 line-clamp-2 mb-6 h-12">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.techStack.map((tech, i) => (
                                        <span key={i} className="text-xs font-semibold text-slate-300 bg-slate-700/50 px-2 py-1 rounded-md">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Calendar className="w-4 h-4" />
                                        {project.period}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* New Project Placeholder (Optional) */}
                    <div 
                        onClick={() => navigate('/projects/write')}
                        className="border-2 border-dashed border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-slate-500 hover:text-slate-300 transition-colors cursor-pointer min-h-[300px]"
                    >
                        <Plus className="w-12 h-12 mb-4 opacity-50" />
                        <p className="font-semibold">새 프로젝트 추가하기</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectPage;
