import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Code2, Link, Github } from 'lucide-react';
import { recruitmentApi, Project } from '../api/mock/recruitment';

const ProjectDetailPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetch
        const fetchDetail = async () => {
            try {
                const all = await recruitmentApi.getProjects();
                const found = all.find(p => p.id === Number(projectId));
                setProject(found || null);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [projectId]);

    if (loading) return <div className="min-h-screen pt-32 text-center text-white">Loading...</div>;
    if (!project) return <div className="min-h-screen pt-32 text-center text-white">PROJECT NOT FOUND</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-28 pb-20 px-6">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> 프로젝트 목록
                </button>

                {/* Hero Banner style header */}
                <div className="glass-dark rounded-3xl p-10 mb-12 relative overflow-hidden">
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex gap-4 mb-6">
                            <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-semibold border border-white/10">
                                {project.role}
                            </span>
                            <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-semibold border border-white/10 flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> {project.period}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
                        <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-3 mt-8">
                            {project.techStack.map((tech) => (
                                <span key={tech} className="px-4 py-2 bg-slate-800 rounded-lg text-blue-300 font-medium border border-slate-700">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar: Meta Info */}
                    <div className="space-y-6">
                        <div className="glass-dark p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Link className="w-5 h-5 text-blue-400" /> Links
                            </h3>
                            <div className="space-y-3">
                                <a href="#" className="block p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/50 text-sm text-slate-300 flex items-center gap-2">
                                    <Github className="w-4 h-4" /> GitHub Repository
                                </a>
                                <a href="#" className="block p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors border border-slate-700/50 text-sm text-slate-300 flex items-center gap-2">
                                    <Link className="w-4 h-4" /> Live Demo
                                </a>
                            </div>
                        </div>

                        <div className="glass-dark p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-purple-400" /> Team
                            </h3>
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-slate-700 border-2 border-slate-900" />
                                ))}
                                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs text-slate-400">
                                    +2
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Description */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-dark p-8 rounded-3xl">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Code2 className="w-6 h-6 text-green-400" /> 상세 내용
                            </h2>
                            <div className="prose prose-invert max-w-none text-slate-300">
                                <p>
                                    이 프로젝트는 ~~한 목표를 가지고 시작되었습니다. <br />
                                    주요 기능으로는 A, B, C가 있으며, 저는 <strong>{project.role}</strong>를 맡아 ~~ 부분을 담당했습니다.
                                </p>
                                <h3 className="text-white mt-8 mb-4 text-xl font-bold">🛠️ 문제 해결 과정</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>성능 최적화를 위해 React Query 도입</li>
                                    <li>컴포넌트 재사용성을 높이기 위한 Atomic Design 적용</li>
                                </ul>
                                <h3 className="text-white mt-8 mb-4 text-xl font-bold">📈 성과</h3>
                                <p>
                                    초기 로딩 속도 30% 개선, 사용자 재방문율 15% 증가 등의 성과를 달성했습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProjectDetailPage;
