import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, ThumbsUp, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import { communityApi, TILItem } from '../api/mock/community';

const TILDetailPage = () => {
    const { tilId } = useParams();
    const navigate = useNavigate();
    const [til, setTil] = useState<TILItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching detail by ID from the mock list for now
        // In real app, call communityApi.getTILDetail(id)
        const fetchDetail = async () => {
            try {
                const allTils = await communityApi.getTILs();
                const found = allTils.find(t => t.id === Number(tilId));
                // Fallback mock if not found in short list
                setTil(found || {
                    id: 999,
                    title: 'Mock Detail Title',
                    content: 'This is a detailed view of the TIL...',
                    author: 'MockUser',
                    date: '2025-01-01',
                    tags: ['Mock'],
                    reactions: 100
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [tilId]);

    if (loading) return <div className="min-h-screen pt-32 text-center text-white">Loading...</div>;
    if (!til) return <div className="min-h-screen pt-32 text-center text-white">NOT FOUND</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-28 pb-20 px-6">
            <div className="max-w-4xl mx-auto">

                {/* Navigation */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> 목록으로 돌아가기
                </button>

                {/* Article Header */}
                <div className="mb-10">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {til.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-300 text-sm font-bold rounded-full border border-blue-500/20">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{til.title}</h1>

                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-white">{til.author}</p>
                                <p className="text-sm text-slate-500 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> {til.date}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="prose prose-invert max-w-none mb-16">
                    <div className="glass-dark p-8 rounded-3xl min-h-[400px]">
                        {/* Simple whitespace handling for now */}
                        <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-line">
                            {til.content}
                            {`\n\n(더시미 데이터가 없습니다. 실제 구현 시에는 마크다운 렌더러가 필요할 수 있습니다.)`}
                        </p>
                    </div>
                </div>

                {/* Reaction Bar (Floating or Bottom) */}
                <div className="flex justify-center gap-6">
                    <button className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full transition-all hover:scale-105 active:scale-95 group">
                        <ThumbsUp className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        <span className="font-bold text-lg">{til.reactions}</span>
                    </button>
                    <button className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full transition-all hover:scale-105 active:scale-95">
                        <MessageSquare className="w-6 h-6 text-slate-400" />
                        <span className="font-bold text-lg">댓글 0</span>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TILDetailPage;
