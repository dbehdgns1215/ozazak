import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, MessageSquare, ThumbsUp, Eye, PenTool, Hash, ArrowLeft } from 'lucide-react';
import { communityApi } from '../api/mock/community';

const boardTitles = {
    'free': '자유게시판',
    'hot': '핫게시판',
    'reviews': '취업후기',
    'correction': '자소서 첨삭',
    'study': '스터디 모집',
    'qna': '질문 & 답변'
};

const CommunityListPage = () => {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Map boardId to category logic if needed, or just display title
    const title = boardTitles[boardId] || '커뮤니티';

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch categories and posts
                const [catsRes, postsRes] = await Promise.all([
                    communityApi.getCategories(),
                    communityApi.getPosts(boardId) // Pass boardId as category filter if applicable
                ]);

                setCategories(catsRes);

                // Mock filter by boardId logic if needed on client side or API
                let filteredPosts = postsRes;
                if (boardId && boardId !== 'all') {
                    // Simple mock filtering based on some logic or just show all for now
                }
                setPosts(filteredPosts);
            } catch (e) {
                console.error("Failed to load community data", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [boardId]);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof post.author === 'string' ? post.author : post.author.nickname).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen text-white pt-24 pb-20 px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <button
                    onClick={() => navigate('/community')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> 메인으로
                </button>

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{title}</h1>
                        <p className="text-slate-400">개발자들을 위한 소통 공간입니다.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/community/write')}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                    >
                        <PenTool className="w-5 h-5" />
                        글쓰기
                    </button>
                </div>

                {/* Search & Filter Bar */}
                <div className="glass-dark p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 border border-white/5">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="제목 또는 작성자로 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                    </div>
                    {/* Categories (Mock Tabs) */}
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {/* Might not need tabs inside list page if boardId handles it, but keeping as placeholders */}
                    </div>
                </div>

                {/* Posts List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-20 text-slate-500">Loading...</div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-20 glass-dark rounded-3xl border border-white/5">
                            <p className="text-slate-400 mb-2">게시글이 없습니다.</p>
                            <p className="text-sm text-slate-600">첫 번째 글을 작성해보세요!</p>
                        </div>
                    ) : (
                        filteredPosts.map(post => {
                            const authorName = typeof post.author === 'object' ? post.author.nickname : post.author;
                            const authorImg = typeof post.author === 'object' ? post.author.profileImage : null;

                            return (
                                <div
                                    key={post.id}
                                    onClick={() => navigate(`/community/post/${post.id}`)}
                                    className="glass-dark p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 hover:bg-white/5 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-white/5">
                                                    {post.category}
                                                </span>
                                                <span className="text-xs text-slate-500">{new Date(post.date || post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-200 mb-2 group-hover:text-indigo-300 transition-colors truncate">
                                                {post.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                                <span className="flex items-center gap-2 text-slate-400">
                                                    {authorImg ? (
                                                        <img src={authorImg} alt={authorName} className="w-5 h-5 rounded-full" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">
                                                            {authorName[0]}
                                                        </div>
                                                    )}
                                                    {authorName}
                                                </span>
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {post.views}</span>
                                                    <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {post.likes || post.reactions || 0}</span>
                                                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {post.comments || post.commentsCount || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination Mock */}
                {!isLoading && filteredPosts.length > 0 && (
                    <div className="flex justify-center mt-10 gap-2">
                        <button className="px-4 py-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 text-sm">Prev</button>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold">1</button>
                        <button className="px-4 py-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white text-sm">2</button>
                        <button className="px-4 py-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white text-sm">3</button>
                        <button className="px-4 py-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 text-sm">Next</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityListPage;
