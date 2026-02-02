import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTils } from '../api/til';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Search, Filter, Hash, ThumbsUp, MessageCircle, MoreHorizontal, User, Flame, TrendingUp, Heart, Eye, Code2 } from 'lucide-react';

interface TILAuthor {
    name: string;
    img?: string;
    companyName?: string;
}

interface TILItem {
    id: string | number;
    title: string;
    content: string;
    author: TILAuthor;
    tags?: string[];
    reactions?: number;
    view?: number;
    commentCount?: number;
    createdAt?: string;
}

interface PageInfo {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
}

const TILPage = () => {
    const navigate = useNavigate();
    const auth = useAuth() as any; // Type assertion for JS context
    const isAuthenticated = auth?.isAuthenticated ?? false;
    const authLoading = auth?.loading ?? true;
    
    // Check authentication - redirect immediately if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/', { 
                replace: true,
                state: { 
                    showToast: true, 
                    toastMessage: '로그인이 필요한 서비스입니다. 로그인 후 이용해주세요.',
                    toastType: 'error'
                }
            });
        }
    }, [isAuthenticated, authLoading, navigate]);
    
    // Don't render page content if not authenticated
    if (!authLoading && !isAuthenticated) {
        return null;
    }
    
    // API State
    const [tils, setTils] = useState<TILItem[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // API Filters (Server-side)
    const [authorStatus, setAuthorStatus] = useState(''); // '' | 'passed' | 'default'
    const [tagsInput, setTagsInput] = useState(''); // Comma-separated string
    const [authorId, setAuthorId] = useState('');
    const [page, setPage] = useState(0); // 0-based pagination
    const size = 10;
    
    // Local Filter (Client-side)
    const [searchQuery, setSearchQuery] = useState('');
    
    // Race condition prevention
    const abortControllerRef = useRef<AbortController | null>(null);
    const loadMoreLock = useRef(false);
    
    // UI Refs
    const rightCardsRef = useRef<HTMLDivElement[]>([]);

    // Fetch TILs from API
    const fetchTils = async (currentPage: number, isAppend = false) => {
        // Abort previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        setLoading(true);
        setError(null);
        
        try {
            const params: any = {
                page: currentPage,
                size,
                signal: abortControllerRef.current.signal
            };
            
            // Add optional filters
            if (authorStatus && authorStatus !== '') {
                params.authorStatus = authorStatus;
            }
            
            if (tagsInput && tagsInput.trim()) {
                params.tags = tagsInput;
            }
            
            if (authorId && authorId.trim()) {
                params.authorId = parseInt(authorId, 10);
            }
            
            const response = await getTils(params);
            const items = (response.data?.items || response.items || []).map((item: any) => ({
                ...item,
                id: item.tilId || item.id // Map tilId to id for consistency
            }));
            const pInfo = response.data?.pageInfo || response.pageInfo || null;
            
            if (isAppend) {
                setTils(prev => [...prev, ...items]);
            } else {
                setTils(items);
            }
            
            setPageInfo(pInfo);
            
            // Clear error on successful response (even if empty)
            setError(null);
        } catch (err: any) {
            if (err?.name === 'CanceledError' || err?.name === 'AbortError') {
                // Ignore aborted requests
                return;
            }
            console.error('Failed to fetch TILs:', err);
            
            // Only set error for actual failures, not empty data
            setError('Failed to load TILs. Please try again.');
            
            // Clear TILs on error to avoid showing stale data
            if (!isAppend) {
                setTils([]);
            }
        } finally {
            setLoading(false);
            loadMoreLock.current = false;
        }
    };

    // Effect: Fetch on mount and when filters change
    useEffect(() => {
        // Reset to page 0 when filters change (0-based pagination)
        setPage(0);
        fetchTils(0, false);
        
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [authorStatus, tagsInput, authorId]);

    // Handler: Load More
    const handleLoadMore = () => {
        if (loadMoreLock.current || loading || !pageInfo?.hasNext) return;
        
        loadMoreLock.current = true;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTils(nextPage, true);
    };

    // Client-side filter for search
    const filteredTils = searchQuery.trim()
        ? tils.filter(til =>
            til.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            til.content?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : tils;

    // Helper: Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen text-white pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Left Sidebar (Sticky) */}
                <aside className="hidden lg:block w-80 shrink-0 sticky top-28 h-fit space-y-8">

                    {/* Filters */}
                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-300">
                            <Filter className="w-4 h-4" /> Filters
                        </h3>
                        <div className="space-y-2">
                            {[
                                { value: '', label: '전체 보기' },
                                { value: 'passed', label: '합격자 TIL' },
                                { value: 'default', label: '기본' }
                            ].map(f => (
                                <button
                                    key={f.value}
                                    onClick={() => setAuthorStatus(f.value)}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                                        authorStatus === f.value 
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                            : 'bg-slate-800/30 text-slate-400 hover:bg-slate-800'
                                    }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags Input */}
                    <div className="glass-dark p-6 rounded-3xl border border-white/5">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-300">
                            <Hash className="w-4 h-4" /> Tags Filter
                        </h3>
                        <input
                            type="text"
                            placeholder="React, TypeScript, ..."
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        />
                        <p className="text-xs text-slate-500 mt-2">쉼표로 구분하여 입력</p>
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
                                placeholder="제목/내용 검색 (로컬)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-800 btn-glass rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2 ml-1">검색은 현재 로딩된 글에서만 필터링됩니다.</p>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden lg:block glass-dark p-4 rounded-2xl mb-8 sticky top-5 z-20 backdrop-blur-xl">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 text-slate-500 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="제목/내용 검색 (로컬 필터)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none py-2 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none text-lg"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-1 ml-12">검색은 현재 로딩된 글에서만 필터링됩니다.</p>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
                            {error}
                            <button
                                onClick={() => fetchTils(0, false)}
                                className="ml-4 underline hover:text-red-100"
                            >
                                재시도
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {!error && loading && tils.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">Loading feeds...</div>
                    ) : !error && filteredTils.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">No TILs found.</div>
                    ) : !error ? (
                        <div className="w-full pt-10 pb-[20vh]">
                            {filteredTils.map((til, i) => (
                                <div
                                    key={til.id || i}
                                    ref={el => { if (el) rightCardsRef.current[i] = el; }}
                                    className={`w-full min-h-[50vh] flex justify-center p-4 lg:px-4 
                                                ${i === 0 ? 'items-start' : 'items-center'}`}
                                >
                                    <div
                                        onClick={() => navigate(`/til/${til.id}`)}
                                        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 group"
                                    >
                                        <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                                                    {til.author?.img ? (
                                                        <img 
                                                            src={til.author.img} 
                                                            alt={til.author.name || 'Author'} 
                                                            className="w-full h-full object-cover" 
                                                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.style.display = 'none';
                                                                if (target.parentElement) {
                                                                    target.parentElement.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <User size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{til.author?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-slate-500">{til.author?.companyName || '무소속'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-white relative">
                                            <div className="bg-slate-900 rounded-xl p-4 mb-4 relative overflow-hidden group-hover:shadow-lg transition-shadow">
                                                <div className="flex gap-1.5 mb-3">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                </div>
                                                <div className="space-y-2 opacity-60">
                                                    <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
                                                    <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                                                    <div className="h-2 w-2/3 bg-slate-700 rounded"></div>
                                                    <div className="h-2 w-full bg-slate-700 rounded"></div>
                                                </div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Code2 className="text-white/20 w-16 h-16 group-hover:text-white/40 transition-colors transform group-hover:scale-110 duration-500" />
                                                </div>
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <span className="text-white font-bold border border-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                                        TIL 읽어보기
                                                    </span>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 leading-snug">
                                                {til.title || 'Untitled'}
                                            </h3>
                                            <p className="text-slate-500 text-sm line-clamp-3">
                                                {til.content || ''}
                                            </p>
                                            
                                            {/* Tags */}
                                            {til.tags && til.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-4">
                                                    {til.tags.slice(0, 3).map((tag, idx) => (
                                                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                    {til.tags.length > 3 && (
                                                        <span className="text-xs text-slate-400">+{til.tags.length - 3}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-medium">
                                            <div className="flex gap-4">
                                                <span className="flex items-center gap-1">
                                                    <Heart size={14} className="text-slate-400" /> 
                                                    {til.reactions || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye size={14} /> 
                                                    {til.view || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageCircle size={14} /> 
                                                    {til.commentCount || 0}
                                                </span>
                                            </div>
                                            <span>{formatDate(til.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {/* Load More Button */}
                    {!loading && pageInfo?.hasNext && (
                        <div className="py-8 text-center">
                            <button 
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="px-6 py-3 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default TILPage;
