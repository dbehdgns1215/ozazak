import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, MessageSquare, ThumbsUp, Eye, PenTool } from 'lucide-react';
import { getCommunityPosts, getCommunityCategories } from '../api/community';

const boardTitles = {
    'free': '자유게시판',
    'hot': '핫게시판',
    'reviews': '취업후기',
    'cover-letter': '자소서 첨삭'
}

const CommunityListPage = () => {
    const { boardId } = useParams();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const title = boardTitles[boardId] || '게시판';

    useEffect(() => {
        const loadCombine = async () => {
            setIsLoading(true);
            try {
                // The API calls might need to be adjusted based on boardId
                const [catsRes, postsRes] = await Promise.all([
                    getCommunityCategories(),
                    getCommunityPosts(activeCategory === 'ALL' ? undefined : activeCategory)
                ]);
                setCategories([{ code: 'ALL', name: '전체' }, ...catsRes.data]);
                setPosts(postsRes.data);
            } catch (e) {
                console.error("Failed to load community", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadCombine();
    }, [activeCategory, boardId]);

    return (
        <div className="w-full">
            {/* Header / Filter */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-slate-900 font-bold text-2xl tracking-tight">{title}</h1>
                        <p className="text-slate-600 mt-1">합격/불합격 후기, 면접 경험 공유</p>
                    </div>
                    <button className="px-6 py-2.5 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                        <PenTool className="w-4 h-4" />
                        글쓰기
                    </button>
                </div>

                <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat.code}
                                onClick={() => setActiveCategory(cat.code)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === cat.code
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="검색..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Post List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-20 text-slate-400">게시글을 불러오는 중...</div>
                ) : (
                    posts.map(post => (
                        <div
                            key={post.id}
                            className="bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm rounded-xl p-6 hover:border-primary transition-all cursor-pointer group hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded">{post.category}</span>
                                        <span className="text-xs text-slate-400">{new Date(post.date).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                                                {post.author[0]}
                                            </div>
                                            {post.author}
                                        </span>
                                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {post.views}</span>
                                        <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {post.comments}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommunityListPage;
