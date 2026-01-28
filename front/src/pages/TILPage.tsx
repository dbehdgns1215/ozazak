import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityApi, TILItem } from '../api/mock/community';
import { BookOpen, Search, Filter, Hash, ThumbsUp, MessageCircle, MoreHorizontal, User, Flame, TrendingUp } from 'lucide-react';

const TILPage = () => {
    const navigate = useNavigate();
    const [tils, setTils] = useState<TILItem[]>([]);
    const [filteredTils, setFilteredTils] = useState<TILItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, PASSED, FOLLOWING
    const [searchQuery, setSearchQuery] = useState('');

    // Sidebar Tags (Mock)
    const popularTags = ['React', 'TypeScript', 'Next.js', 'Algorithm', 'CS', 'Interview'];

    useEffect(() => {
        const fetchTILs = async () => {
            // Simulate loading
            setTimeout(async () => {
                try {
                    const data = await communityApi.getTILs();
                    // Duplicate data to simulate feed
                    const feedData = [...data, ...data, ...data].map((item, i) => ({ ...item, id: `${item.id}_${i}` }));
                    setTils(feedData);
                    setFilteredTils(feedData);
                } catch (error) {
                    console.error("Failed to fetch TILs", error);
                } finally {
                    setLoading(false);
                }
            }, 800);
        };
        fetchTILs();
    }, []);

    useEffect(() => {
        let result = tils;
        if (searchQuery) {
            result = result.filter(t =>
                t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }
        if (activeFilter === 'FOLLOWING') {
            // Mock filter
            result = result.slice(0, 2);
        }
        setFilteredTils(result);
    }, [searchQuery, activeFilter, tils]);

    return (
        <div className="min-h-screen text-white pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex flex-collg:flex-row gap-8">

                {/* Left Sidebar (Sticky) */}
                <aside className="hidden lg:block w-80 shrink-0 sticky top-28 h-fit space-y-8">
                    {/* User Activity Summary */}
                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px]">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=MyUser" alt="Me" className="w-full h-full rounded-full bg-slate-800" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">My Activity</h3>
                                <p className="text-slate-400 text-sm">Junior Developer</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="bg-slate-800/50 p-3 rounded-2xl">
                                <p className="text-2xl font-bold text-blue-400">12</p>
                                <p className="text-xs text-slate-500">This Month</p>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-2xl">
                                <p className="text-2xl font-bold text-green-400">365</p>
                                <p className="text-xs text-slate-500">Total Views</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-300">
                            <Filter className="w-4 h-4" /> Filters
                        </h3>
                        <div className="space-y-2">
                            {['ALL', 'PASSED', 'FOLLOWING'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${activeFilter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800'}`}
                                >
                                    {f === 'ALL' && '전체 보기'}
                                    {f === 'PASSED' && '합격자 TIL'}
                                    {f === 'FOLLOWING' && '팔로잉'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-300">
                            <Hash className="w-4 h-4" /> Trending Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {popularTags.map(tag => (
                                <button key={tag} onClick={() => setSearchQuery(tag)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-sm border border-slate-700 transition-colors">
                                    #{tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="flex-1 w-full max-w-3xl mx-auto space-y-6">
                    {/* Mobile Search (Visible on small screens) */}
                    <div className="lg:hidden mb-6">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search TILs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-800 btn-glass rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden lg:block glass-dark p-4 rounded-2xl mb-8 sticky top-5 z-20 backdrop-blur-xl">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 text-slate-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by title, content, or tag..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none py-2 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none text-lg"
                            />
                            <div className="flex gap-2">
                                <select className="bg-slate-800 border-none rounded-lg text-sm text-slate-400 py-1 px-3 focus:ring-0">
                                    <option>Latest</option>
                                    <option>Popular</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-slate-500">Loading feeds...</div>
                    ) : filteredTils.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">No TILs found.</div>
                    ) : (
                        filteredTils.map((til) => (
                            <div key={til.id} className="glass-dark p-6 md:p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors group">
                                {/* Author Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <img src={til.author.profileImage} alt={til.author.nickname} className="w-10 h-10 rounded-full bg-slate-700" />
                                        <div>
                                            <p className="font-bold text-sm text-slate-200">{til.author.nickname}</p>
                                            <p className="text-xs text-slate-500">{new Date(til.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <button className="text-slate-500 hover:text-white">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content Preview */}
                                <div className="cursor-pointer" onClick={() => navigate(`/til/${String(til.id).split('_')[0]}`)}>
                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-indigo-300 transition-colors">{til.title}</h2>
                                    <p className="text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                                        {til.content}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {til.tags.map((tag, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-blue-500/10 text-blue-300 text-xs font-bold rounded-full border border-blue-500/20">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Footer */}
                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                    <div className="flex gap-4">
                                        <button className={`flex items-center gap-2 text-sm font-medium ${til.isLiked ? 'text-blue-400' : 'text-slate-400'} hover:text-blue-400 transition-colors`}>
                                            <ThumbsUp className={`w-5 h-5 ${til.isLiked ? 'fill-current' : ''}`} />
                                            {til.reactions}
                                        </button>
                                        <button className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                            <MessageCircle className="w-5 h-5" />
                                            {til.commentsCount || 0}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/til/${String(til.id).split('_')[0]}`)}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                                    >
                                        Read more
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Infinite Scroll Mock */}
                    {!loading && filteredTils.length > 0 && (
                        <div className="py-8 text-center">
                            <button className="px-6 py-3 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors text-sm">
                                Load More
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default TILPage;
