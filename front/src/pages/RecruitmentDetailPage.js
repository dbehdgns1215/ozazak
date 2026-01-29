import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Building, Heart, Sparkles, ExternalLink, Share2, MoreHorizontal } from 'lucide-react';
import { mockRecruitments } from '../api/mock/recruitmentData';

const RecruitmentDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        // Simulate API fetch delay
        setTimeout(() => {
            const found = mockRecruitments.find(r => r.id === id) || mockRecruitments[0];
            setJob(found);
            setIsBookmarked(found.isBookmarked);
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) return <div className="min-h-screen pt-32 text-center text-white">Loading...</div>;
    if (!job) return <div className="min-h-screen pt-32 text-center text-white">Job Not Found</div>;

    return (
        <div className="min-h-screen text-white relative">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-32">
                {/* Navigation */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> 채용 공고 목록
                </button>

                {/* Header Section */}
                <header className="mb-10">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-2xl font-bold text-slate-900 shadow-lg">
                                {job.company[0]}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-1">{job.title}</h1>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <span className="flex items-center gap-1 font-medium text-white">
                                        <Building className="w-4 h-4" /> {job.company}
                                    </span>
                                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" /> {job.workplaceInfo}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="px-4 py-2 bg-red-500/20 text-red-400 font-bold rounded-lg border border-red-500/30 flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4" /> D-{job.dDay}
                            </div>
                            <span className="text-sm text-slate-500">
                                마감일: {new Date(job.deadline).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-700">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </header>

                {/* Main Content Body */}
                <div className="grid gap-8">
                    {/* Poster Image */}
                    <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative group">
                        <img
                            src={job.posterImage}
                            alt={job.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60" />
                    </div>

                    {/* Description */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/5 bg-slate-800/30 backdrop-blur-xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-400" /> 상세 요강
                        </h2>
                        <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-line">
                            {job.description}
                            {`\n\n
                            • 주요 업무
                            - 웹 프론트엔드 개발 및 운영
                            - 사용자 경험 개선을 위한 UI/UX 개발
                            
                            • 자격 요건
                            - React, Vue 등 Modern Framework 사용 경험
                            - HTML, CSS, JavaScript에 대한 깊은 이해
                            
                            • 우대 사항
                            - TypeScript 사용 경험
                            - 성능 최적화 경험
                            `}
                        </div>
                    </div>

                    {/* Workplace Info */}
                    <div className="glass-dark p-8 rounded-3xl border border-white/5 bg-slate-800/30 backdrop-blur-xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-green-400" /> 근무지 정보
                        </h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 bg-slate-800 rounded-xl h-48 flex items-center justify-center text-slate-500 border border-slate-700">
                                Map Placeholder
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <h3 className="font-bold text-lg mb-2">{job.workplaceInfo}</h3>
                                <p className="text-slate-400 mb-4">{job.address}</p>
                                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm self-start transition-colors">
                                    길찾기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 w-full glass-dark border-t border-white/10 p-4 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`flex flex-col items-center gap-1 min-w-[60px] ${isBookmarked ? 'text-red-400' : 'text-slate-400'} hover:text-red-400 transition-colors`}
                        >
                            <Heart className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
                            <span className="text-xs font-medium">관심</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 min-w-[60px] text-slate-400 hover:text-white transition-colors">
                            <Share2 className="w-6 h-6" />
                            <span className="text-xs font-medium">공유</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <button
                            onClick={() => navigate('/cover-letter')}
                            className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
                        >
                            <Sparkles className="w-5 h-5" />
                            자소서 생성하기
                        </button>
                        <button className="flex-1 md:flex-none px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                            지원하러 가기 <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentDetailPage;
