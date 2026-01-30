 import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '../api/project';
import { Project } from '../api/mock/recruitment'; // Keeping Type definition
import { FolderGit2, Code2, Calendar, ChevronRight, Plus } from 'lucide-react';

const ProjectPage = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState<any>(null); // { currentPage, totalPages, ... }
    const [currentPage, setCurrentPage] = useState(0);

    const fetchProjects = async (page: number) => {
        setLoading(true);
        try {
            // Pass page params if API supports it. Assuming getProjects accepts config or query params
            // For now, let's assume getProjects(page, size) is what we intended in the plan
            // But since I haven't updated api/project.js yet to take args, I will just call getProjects() 
            // and expect the component to handle the query string construction if I updated the API details.
            // Actually, I should update the API call in api/project.js first or pass params here if it supports it.
            // Let's assume getProjects passes args through.
            const response: any = await getProjects(page, 9); 
            console.log("Projects API Response:", response);

            const dataRoot = response.data || response;
            const contents = dataRoot.contents || [];
            const pageData = dataRoot.pageInfo || null;

            // Map API Data to UI Model
            const mappedProjects = contents.map((item: any) => ({
                id: item.projectId,
                title: item.title,
                description: item.content ? item.content.slice(0, 100) + (item.content.length > 100 ? '...' : '') : '',
                techStack: item.tags || [],
                role: 'Project Lead', // Default since API doesn't seem to return specific role per project in list clearly or maybe it's missing
                period: `${item.startedAt} ~ ${item.endedAt || 'Present'}`,
                thumbnailUrl: item.thumbnailUrl,
                author: item.author,
                startedAt: item.startedAt,
                endedAt: item.endedAt
            }));

            setProjects(mappedProjects);
            setPageInfo(pageData);

        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && (!pageInfo || newPage < pageInfo.totalPages)) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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
                {loading ? (
                    <div className="text-center py-20 text-slate-500">Loading projects...</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    className="group relative glass-dark rounded-3xl overflow-hidden hover:bg-slate-800/40 transition-all cursor-pointer border border-white/5 hover:border-blue-500/30 flex flex-col"
                                >
                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />

                                    {/* Large Thumbnail Section */}
                                    <div className="w-full aspect-video bg-slate-800 relative overflow-hidden">
                                        {project.thumbnailUrl ? (
                                            <img 
                                                src={project.thumbnailUrl} 
                                                alt="thumbnail" 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-700">
                                                <FolderGit2 className="w-12 h-12 opacity-50" />
                                            </div>
                                        )}
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60" />
                                        
                                        {/* Floating Role Badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10 shadow-sm">
                                                {project.role}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 flex flex-col flex-1 relative z-10">
                                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors line-clamp-1">
                                            {project.title}
                                        </h3>

                                        {/* Tech Stack */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {project.techStack.slice(0, 3).map((tech, i) => (
                                                <span key={i} className="text-xs font-semibold text-slate-300 bg-slate-700/50 px-2.5 py-1 rounded-md border border-white/5">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.techStack.length > 3 && (
                                                <span className="text-xs font-semibold text-slate-500 px-1 py-1">
                                                    +{project.techStack.length - 3}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                                                <Calendar className="w-4 h-4 text-slate-500" />
                                                {project.period}
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <ChevronRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* New Project Placeholder */}
                            <div 
                                onClick={() => navigate('/projects/write')}
                                className="border-2 border-dashed border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-500 hover:border-slate-500 hover:text-slate-300 transition-colors cursor-pointer min-h-[300px]"
                            >
                                <Plus className="w-12 h-12 mb-4 opacity-50" />
                                <p className="font-semibold">새 프로젝트 추가하기</p>
                            </div>
                        </div>

                        {/* Pagination */}
                        {pageInfo && (
                            <div className="flex justify-center mt-16 gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: pageInfo.totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePageChange(i)}
                                        className={`w-10 h-10 rounded-lg font-bold transition-all ${
                                            currentPage === i
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= pageInfo.totalPages - 1}
                                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ProjectPage;
