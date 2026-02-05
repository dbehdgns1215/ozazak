import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTils } from '../api/til';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { stripMarkdown } from '../utils/textUtils';
import {
    BookOpen, Search, Filter, Hash, MessageCircle, User,
    Heart, PenTool, FileText, Edit3, ArrowUp, Code2, Briefcase, Bookmark
} from 'lucide-react';

// TIL Item 타입 정의 (API 응답 기준)
interface TILAuthor {
    accountId: number;
    name: string;
    img: string | null;
    companyName: string | null;
}

interface TILItem {
    communityId: number;
    tilId?: number;
    title: string;
    content: string;
    author: TILAuthor;
    tags: string[];
    view: number;
    commentCount: number;
    reaction: any[];
    reactions?: any[];
    createdAt: string;
}

// 댓글 타입 정의
interface Comment {
    id: string;
    author: string;
    content: string;
    createdAt: string;
}

const TILPage = () => {
    const navigate = useNavigate();
    const auth = useAuth() as any; // Type assertion for JS context
    const isAuthenticated = auth?.isAuthenticated ?? false;
    const authLoading = auth?.loading ?? true;
    const user = auth?.user;

    // --- State Management ---
    const [tils, setTils] = useState<TILItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    
    // Filters (UI State)
    const [authorStatus, setAuthorStatus] = useState<'' | 'passed' | 'default'>(''); 
    const [tagsInput, setTagsInput] = useState(''); 
    const [searchQuery, setSearchQuery] = useState('');
    
    // Debounced Values for API Calls (Fixes IME/Live Search issues)
    const debouncedTags = useDebounce(tagsInput, 300);
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Pagination State
    const [page, setPage] = useState(0);

    // Refs for Logic
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isFetchingRef = useRef(false);
    
    // Refs for latest state access in async/observer
    const pageRef = useRef(0);
    const hasMoreRef = useRef(true);
    const authorStatusRef = useRef(authorStatus);
    const tagsRef = useRef(debouncedTags);
    const searchRef = useRef(debouncedSearch);

    // Sync Refs
    useEffect(() => { pageRef.current = page; }, [page]);
    useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
    useEffect(() => { authorStatusRef.current = authorStatus; }, [authorStatus]);
    useEffect(() => { tagsRef.current = debouncedTags; }, [debouncedTags]);
    useEffect(() => { searchRef.current = debouncedSearch; }, [debouncedSearch]);

    // Top Button State
    const [showTopBtn, setShowTopBtn] = useState(false);

    // 썸네일용 파스텔 그라데이션 배열
    const gradients = [
        "from-rose-50 to-orange-50",
        "from-blue-50 to-indigo-50",
        "from-green-50 to-emerald-50",
        "from-purple-50 to-fuchsia-50",
        "from-amber-50 to-yellow-50",
    ];

    // 태그 리스트 (추천 태그)
    const tags = ['업무일지', '트러블슈팅', '개발공부', '마케팅인사이트', '기획서작성', '데이터분석', '오늘의배움', '회고'];

    // --- Auth Check ---
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

    // --- Fetch Logic ---
    const fetchTILs = useCallback(async (pageNum: number, reset: boolean = false) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        if (reset) setError(null);

        try {
            const params: any = {
                page: pageNum,
                size: 10,
                sort: 'createdAt,desc', // Sort by newest
                signal: controller.signal
            };

            // Apply Filters (using refs to ensure latest values if called from stale closures)
            if (authorStatusRef.current) {
                params.authorStatus = authorStatusRef.current;
            }
            if (tagsRef.current) {
                params.tags = tagsRef.current;
            }
            if (searchRef.current) {
                // Assuming backend supports a generic 'query' or searching by title/content via specific params
                // Based on previous code, search was by title/content/author
                // Here we map the main search bar to 'title' or 'content' implicitly or effectively?
                // Let's assume standard 'keyword' or 'query' if backend supports, 
                // OR default to 'title' if not specified.
                // Looking at conflict, developed-frontend used 'searchQuery' but didn't clearly map it in fetchTils (it was missing).
                // HEAD code had: switch(searchOption) ...
                // Let's send it as 'title' for now, or 'query' if backend supports it.
                // Safety: Send as 'title' which is most common default search.
                params.title = searchRef.current; 
            }

            const response = await getTils(params);
            
            let newItems: TILItem[] = [];
            let responseData: any = null;
            
            // Normalize Response
            if (response?.data?.items) {
                newItems = response.data.items;
                responseData = response.data;
            } else if (response?.items) {
                newItems = response.items;
                responseData = response;
            } else if (Array.isArray(response?.data)) {
                newItems = response.data; // Fallback
            } else if (Array.isArray(response)) {
                newItems = response; // Fallback
            }

            // Map ID consistency if needed
            newItems = newItems.map((item: any) => ({
                ...item,
                id: item.communityId || item.tilId || item.id, // Ensure ID exists for React keys
                tilId: item.communityId || item.tilId || item.id // Map communityId to tilId
            }));

            // Client-side sort to ensure order within the page
            newItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
            if (newItems.length > 0) {
                console.log('[TILPage] Fetched Items (First 3):', newItems.slice(0, 3).map(i => ({ id: i.tilId, date: i.createdAt })));
            } else {
                console.log('[TILPage] No items fetched.');
            }

            if (reset) {
                setTils(newItems);
            } else {
                setTils(prev => [...prev, ...newItems]);
            }

            // Calculate Has More
            let computedHasMore = false;
            if (responseData?.hasNext !== undefined) {
                computedHasMore = responseData.hasNext;
            } else if (responseData?.pageInfo?.hasNext !== undefined) {
                computedHasMore = responseData.pageInfo.hasNext;
            } else {
                computedHasMore = newItems.length === 10; // Fallback based on size
            }
            setHasMore(computedHasMore);

        } catch (error: any) {
             if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                console.error('[FETCH] ERROR:', error);
                if (reset) setError('데이터를 불러오는데 실패했습니다.');
            }
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, []);

    // --- Effects ---

    // 1. Filter Changes -> Reset & Fetch (Debounced)
    useEffect(() => {
        // Reset state
        setPage(0);
        setTils([]);
        setHasMore(true);
        // Fetch page 0
        fetchTILs(0, true);
    }, [authorStatus, debouncedTags, debouncedSearch, fetchTILs]);

    // 2. Infinite Scroll Observer
    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasMoreRef.current && !isFetchingRef.current) {
                 setPage(prev => {
                     const nextPage = prev + 1;
                     fetchTILs(nextPage, false);
                     return nextPage;
                 });
            }
        }, { threshold: 0.1, rootMargin: '200px' });

        observer.observe(loadMoreRef.current);
        observerRef.current = observer;

        return () => observer.disconnect();
    }, [fetchTILs]); // Dependency stable

    // 3. Re-observe when data changes
    useEffect(() => {
        if (observerRef.current && loadMoreRef.current) {
            observerRef.current.disconnect();
            if (hasMore) {
                observerRef.current.observe(loadMoreRef.current);
            }
        }
    }, [tils.length, hasMore]);


    // 4. Scroll Top Button
    useEffect(() => {
        const handleScroll = () => {
            setShowTopBtn(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    // Don't render content if not authenticated
    if (!authLoading && !isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pt-8 pb-20 px-4 sm:px-6 lg:px-8 font-sans fade-in rounded-[30px]">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Left Sidebar (Sticky) */}
                <aside className="hidden lg:block w-72 shrink-0 sticky top-8 h-fit space-y-6">
                    {/* User Profile Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full p-1 mb-3 relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full animate-spin-slow opacity-75 blur-sm group-hover:opacity-100 transition-opacity"></div>
                            <img 
                                src={(user?.img && user.img.trim()) || '/default-profile.jpg'}
                                alt={user?.name || "Member"}
                                className="w-full h-full rounded-full bg-slate-100 relative z-10 object-cover border-2 border-white"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/default-profile.jpg'; }}
                            />
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">{user?.name || 'Guest'}</h3>
                        <p className="text-slate-500 text-xs mb-6">{user?.email || 'Start your journey'}</p>
                        
                        <button 
                            onClick={() => navigate('/til/write')}
                            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                            <PenTool className="w-4 h-4" />
                            TIL 작성하기
                        </button>
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="flex-1 w-full max-w-4xl mx-auto space-y-6">
                    <div className="lg:hidden mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Knowledge Feed</h2>
                    </div>

                    {/* Unified Navigation (Filters + Search + Tags) */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4 mb-8 sticky top-8 z-30">
                        {/* Row 1: View Options + Search Inputs */}
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* View Options (Tabs) */}
                            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto no-scrollbar h-10 items-center">
                                {[
                                    { value: '', label: '전체', icon: BookOpen },
                                    { value: 'passed', label: '합격자', icon: FileText },
                                    { value: 'default', label: '일반', icon: Edit3 }
                                ].map(f => (
                                    <button
                                        key={f.value}
                                        onClick={() => setAuthorStatus(f.value as any)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap h-8 ${
                                            authorStatus === f.value
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                    >
                                        <f.icon className="w-3.5 h-3.5" />
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            {/* Search Fields Wrapper */}
                            <div className="flex-1 flex flex-col sm:flex-row gap-3">
                                {/* Tag Input */}
                                <div className="relative shrink-0 sm:w-48">
                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="태그 검색..."
                                        value={tagsInput}
                                        onChange={(e) => setTagsInput(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 h-10"
                                    />
                                </div>

                                {/* Keyword Search Input */}
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="지식 검색 (제목, 내용)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 h-10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Popular Tags */}
                        <div className="flex items-center gap-4 pt-2 border-t border-slate-50">
                            <div className="flex items-center gap-2 text-slate-400 shrink-0">
                                <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">추천 태그</span>
                            </div>
                            <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                                {['면접후기', '합격꿀팁', '업무일지', '트러블슈팅', '개발공부', '회고', '기획', '디자인'].map(tagName => (
                                    <button
                                        key={tagName}
                                        onClick={() => setTagsInput(prev => prev === tagName ? '' : tagName)}
                                        className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border ${
                                            tagsInput === tagName
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                                        }`}
                                    >
                                        #{tagName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm flex items-center justify-between">
                            <span>{error}</span>
                            <button
                                onClick={() => fetchTILs(0, true)}
                                className="px-3 py-1 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >재시도</button>
                        </div>
                    )}

                    {/* Content List */}
                    {loading && tils.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
                            <p className="text-slate-500">지식을 불러오는 중입니다...</p>
                        </div>
                    ) : tils.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm border-dashed">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">검색 결과가 없습니다.</p>
                            <p className="text-sm text-slate-400 mt-1">다른 키워드로 검색해보세요.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {tils.map((til, i) => (
                                <TILCard key={`til-${til.communityId || til.tilId || i}`} til={til} index={i} gradients={gradients} navigate={navigate} />
                            ))}
                        </div>
                    )}

                    {/* Infinite Scroll Sentinel */}
                    {hasMore && (
                        <div ref={loadMoreRef} className="py-8 text-center">
                            {loading && <div className="inline-block w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>}
                        </div>
                    )}
                </main>
            </div>

            {/* Scroll Top Button */}
            {showTopBtn && (
                <button 
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-all z-50 animate-bounce"
                >
                    <ArrowUp size={24} />
                </button>
            )}
        </div>
    );
};

// --- Sub Component: TILCard (Extracted for cleaner code) ---
const TILCard = ({ til, index, gradients, navigate }: { til: TILItem, index: number, gradients: string[], navigate: any }) => {
    return (
        <article
            onClick={() => navigate(`/community/post/${til.communityId || til.tilId}`)}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full"
        >
             <div className="flex flex-col h-full">
                {/* Thumbnail Area */}
                <div className={`w-full h-40 flex items-center justify-center relative overflow-hidden
                    ${gradients[index % gradients.length]}
                `}>
                    <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                        {index % 3 === 0 ? <BookOpen className="w-10 h-10 text-indigo-300/80" /> :
                         index % 3 === 1 ? <PenTool className="w-10 h-10 text-teal-300/80" /> :
                                           <FileText className="w-10 h-10 text-purple-300/80" />
                        }
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                         <div 
                            className="flex items-center gap-2 hover:opacity-70 transition-opacity z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (til.author?.accountId) navigate(`/users/${til.author.accountId}`);
                            }}
                         >
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                {til.author?.img && til.author.img !== 'default_img.png' ? (
                                    <img src={til.author.img} alt={til.author.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-4 h-4 text-slate-400" />
                                )}
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{til.author?.name}</span>
                        </div>
                         <span className="text-xs text-slate-400">{new Date(til.createdAt).toLocaleDateString()}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {til.title}
                    </h3>

                    <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                        {stripMarkdown(til.content)}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex flex-wrap gap-2 text-xs">
                             {til.tags?.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] sm:text-xs">#{tag}</span>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 text-xs">
                             <span className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5" /> 
                                {(() => {
                                    const reactionsData = til.reactions || til.reaction;
                                    if (Array.isArray(reactionsData)) {
                                        return reactionsData.reduce((acc: number, curr: any) => acc + (curr.count || 0), 0);
                                    }
                                    return 0;
                                })()}
                             </span>
                             <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {til.commentCount || 0}</span>
                        </div>
                    </div>
                </div>
             </div>
        </article>
    );
}

export default TILPage;
