import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityApi, TILItem } from '../api/mock/community';
import { BookOpen, Search, Filter, Hash, ThumbsUp, MessageCircle } from 'lucide-react';

const TILPage = () => {
    const navigate = useNavigate();
    const [tils, setTils] = useState<TILItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTILs = async () => {
            try {
                const data = await communityApi.getTILs();
                setTils(data);
            } catch (error) {
                console.error("Failed to fetch TILs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTILs();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-white pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-6">Today I Learned</h1>
                    <p className="text-slate-400 text-xl max-w-2xl mx-auto">
                        매일매일 배운 내용을 기록하고 공유하세요. <br />
                        작은 배움이 모여 큰 성장이 됩니다.
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-12 glass-dark p-4 rounded-2xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="키워드 검색 (React, Algorithm...)"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-2 text-slate-300 border border-slate-700 transition-colors">
                        <Filter className="w-5 h-5" /> 최신순
                    </button>
                </div>

                {/* Masonry-like Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {tils.map((til) => (
                        <div
                            key={til.id}
                            onClick={() => navigate(`/til/${til.id}`)}
                            className="break-inside-avoid glass-dark rounded-3xl p-6 hover:bg-slate-800/50 hover:scale-[1.02] transition-all cursor-pointer border border-white/5 hover:border-white/10 group"
                        >
                            <div className="flex flex-wrap gap-2 mb-4">
                                {til.tags.map((tag, i) => (
                                    <span key={i} className="px-2.5 py-1 bg-blue-500/10 text-blue-300 text-xs font-bold rounded-full border border-blue-500/20">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-blue-200 transition-colors">
                                {til.title}
                            </h3>

                            <p className="text-slate-400 text-sm line-clamp-3 mb-6">
                                {til.content}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500" />
                                    <span className="text-xs text-slate-300 font-medium">{til.author}</span>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1 group-hover:text-red-400 transition-colors">
                                        <ThumbsUp className="w-3.5 h-3.5" /> {til.reactions}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageCircle className="w-3.5 h-3.5" /> 0
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default TILPage;
