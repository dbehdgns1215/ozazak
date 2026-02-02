import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTils } from '../api/til';
import {
    Search, Filter, Hash, MessageCircle, Heart, Eye, Bookmark, User,
    MoreHorizontal, Flag, ArrowUp, Share2, Briefcase, Code2, PenTool
} from 'lucide-react';

// TIL Item 타입 정의 (API 응답 기준)
interface TILAuthor {
    accountId: number;
    name: string;
    img: string | null;
    companyName: string | null;
}

interface TILItem {
    tilId: number;
    title: string;
    content: string;
    author: TILAuthor;
    tags: string[];
    view: number;
    commentCount: number;
    reaction: any[];
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
    
    // --- State Management ---
    const [tils, setTils] = useState<TILItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    
    // 필터 & 정렬 & 검색
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'PASSED' | 'FOLLOWING' | 'myTil'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOption, setSearchOption] = useState<'TITLE' | 'CONTENT' | 'NICKNAME' | 'TAG'>('TITLE');

    // 무한 스크롤
    const [page, setPage] = useState(0);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    
    // ⭐ CRITICAL: In-flight guard (NOT state - to avoid re-renders)
    const isFetchingRef = useRef(false);
    
    // Refs for observer to read latest values without stale closures
    const pageRef = useRef(0);
    const hasMoreRef = useRef(true);
    const activeFilterRef = useRef(activeFilter);
    const searchQueryRef = useRef(searchQuery);
    const searchOptionRef = useRef(searchOption);

    // Sync refs with state
    useEffect(() => { pageRef.current = page; }, [page]);
    useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
    useEffect(() => {
        activeFilterRef.current = activeFilter;
        searchQueryRef.current = searchQuery;
        searchOptionRef.current = searchOption;
    }, [activeFilter, searchQuery, searchOption]);

    // Top Button
    const [showTopBtn, setShowTopBtn] = useState(false);

    // 썸네일용 파스텔 그라데이션 배열
    const gradients = [
        "from-rose-50 to-orange-50",
        "from-blue-50 to-indigo-50",
        "from-green-50 to-emerald-50",
        "from-purple-50 to-fuchsia-50",
        "from-amber-50 to-yellow-50",
    ];

    // 태그 리스트
    const tags = ['업무일지', '트러블슈팅', '개발공부', '마케팅인사이트', '기획서작성', '데이터분석', '오늘의배움', '회고'];

    // --- Data Fetching with strict in-flight guard ---
    const fetchTILs = useCallback(async (pageNum: number, reset: boolean = false) => {
        // ⭐ HOTFIX: Prevent concurrent fetches
        if (isFetchingRef.current) {
            console.log('[FETCH] BLOCKED - already fetching');
            return;
        }

        isFetchingRef.current = true;
        
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        setLoading(true);
        console.log('[FETCH] start page=', pageNum, 'reset=', reset);
        
        try {
            // Build API params - use refs!
            const params: any = {
                page: pageNum,
                size: 10,
                signal: controller.signal
            };

            // Filter: 합격자 필터 - use ref
            if (activeFilterRef.current === 'PASSED') {
                params.authorStatus = 'passed';
            } else if (activeFilterRef.current === 'FOLLOWING') {
                console.log('Following filter not yet implemented');
            } else if (activeFilterRef.current === 'myTil') {
                 // TODO: Implement My TIL filtering
                 // params.authorId = currentUser.id; 
            }

            // Search based on option - use refs
            if (searchQueryRef.current.trim()) {
                const query = searchQueryRef.current.trim();
                switch (searchOptionRef.current) {
                    case 'TITLE':
                        break;
                    case 'CONTENT':
                        break;
                    case 'NICKNAME':
                        params.authorName = query;
                        break;
                    case 'TAG':
                        params.tags = query;
                        break;
                }
            }

            const response = await getTils({ ...params, signal: controller.signal });
            
            // ⭐ Log full response structure to determine hasMore calculation
            console.log('[FETCH] Full API Response:', JSON.stringify(response, null, 2));
            
            // Handle different possible response structures
            let newItems = [];
            let responseData = null;
            
            if (response?.data?.items) {
                newItems = response.data.items;
                responseData = response.data;
            } else if (response?.items) {
                newItems = response.items;
                responseData = response;
            } else if (Array.isArray(response?.data)) {
                newItems = response.data;
                responseData = { items: response.data };
            } else if (Array.isArray(response)) {
                newItems = response;
                responseData = { items: response };
            }
            
            // ⭐ Log first item to check structure
            if (newItems.length > 0) {
                console.log('[FETCH] First TIL item structure:', newItems[0]);
                console.log('[FETCH] First item keys:', Object.keys(newItems[0]));
            }

            if (reset) {
                setTils(newItems);
            } else {
                setTils(prev => [...prev, ...newItems]);
            }

            // ⭐ Calculate hasMore based on actual response
            // Check if API provides hasNext or similar field
            let computedHasMore = false;
            if (responseData?.hasNext !== undefined) {
                computedHasMore = responseData.hasNext;
            } else if (responseData?.pageInfo?.hasNext !== undefined) {
                computedHasMore = responseData.pageInfo.hasNext;
            } else {
                // Fallback: assume more pages if we got a full page
                computedHasMore = newItems.length === params.size;
            }
            
            setHasMore(computedHasMore);
            
            console.log('[FETCH] end page=', pageNum, 'received=', newItems.length, 'nextHasMore=', computedHasMore);
        } catch (error: any) {
            // Axios throws 'CanceledError' when request is aborted
            if (error.name !== 'CanceledError' && error.code !== 'ERR_CANCELED') {
                console.error('[FETCH] ERROR:', error);
            }
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, []);

    // Fetch data when page changes
    useEffect(() => {
        const isInitialLoad = page === 0;
        fetchTILs(page, isInitialLoad);
    }, [page, fetchTILs]);

    // Reset when filters change
    useEffect(() => {
        setPage(0);
        setTils([]);
        setHasMore(true);
    }, [activeFilter, searchQuery, searchOption]);

    // ⭐ PRODUCTION-SAFE Infinite Scroll Observer
    useEffect(() => {
        if (!loadMoreRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isIntersecting = entry.isIntersecting;
                const currentHasMore = hasMoreRef.current;
                const currentFetching = isFetchingRef.current;
                const currentPage = pageRef.current;
                
                console.log('[OBS] intersect=', isIntersecting, 'hasMore=', currentHasMore, 'fetching=', currentFetching, 'page=', currentPage);
                
                if (!isIntersecting) return;
                if (!currentHasMore) return;
                if (currentFetching) return;

                // ⭐ Unobserve to prevent repeated triggers while sentinel is visible
                if (loadMoreRef.current) {
                    observer.unobserve(loadMoreRef.current);
                }

                // Request next page
                setPage(prev => prev + 1);
            },
            { 
                root: null, 
                threshold: 0.1,
                rootMargin: '200px' 
            }
        );

        observer.observe(loadMoreRef.current);
        observerRef.current = observer;

        return () => observer.disconnect();
    }, []); // Created once!

    // ⭐ Re-observe after successful fetch (if more data available)
    useEffect(() => {
        if (!observerRef.current || !loadMoreRef.current) return;
        if (hasMore && !isFetchingRef.current && tils.length > 0) {
            observerRef.current.observe(loadMoreRef.current);
        }
    }, [hasMore, tils.length]);

    // --- Top Button ---
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) setShowTopBtn(true);
            else setShowTopBtn(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle search button click
    const handleSearch = () => {
        setPage(0);
        setTils([]);
        fetchTILs(0, true);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-20 px-4 md:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                
                {/* 검색창 */}
                <section className="mb-10 w-full max-w-4xl mx-auto">
                    <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-2 items-center">
                        <div className="flex-shrink-0 w-full md:w-40">
                            <select 
                                className="w-full p-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 border-none focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer"
                                value={searchOption}
                                onChange={(e) => setSearchOption(e.target.value as any)}
                            >
                                <option value="TITLE">제목 검색</option>
                                <option value="CONTENT">내용 검색</option>
                                <option value="TAG">태그 검색</option>
                                <option value="NICKNAME">작성자 검색</option>
                            </select>
                        </div>
                        <div className="flex-1 w-full relative">
                            <input 
                                type="text" 
                                placeholder="관심 있는 내용을 검색해보세요 (예: GA4, React, 면접)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full p-3 pl-10 bg-transparent text-slate-900 placeholder:text-slate-400 outline-none text-base"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        </div>
                        <button 
                            onClick={handleSearch}
                            className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md"
                        >
                            검색
                        </button>
                    </div>
                </section>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* --- Left Sidebar (Sticky) --- */}
                    <aside className="hidden lg:block w-72 shrink-0 sticky top-28 h-fit space-y-6">
                        
                        {/* 1. 나의 활동 */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full ring-2 ring-indigo-50 p-1">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=MyUser" alt="Me" className="w-full h-full rounded-full bg-slate-100" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">My TIL</h3>
                                    <p className="text-slate-500 text-sm">오늘의 배움을 기록하세요</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/write?type=til')}
                                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                TIL 작성하기
                            </button>
                        </div>

                        {/* 2. 필터링 */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-700 text-sm uppercase tracking-wider">
                                <Filter className="w-4 h-4" /> 필터링
                            </h3>
                            <div className="space-y-1">
                                {[
                                    { id: 'ALL', label: '전체 TIL 보기' },
                                    { id: 'PASSED', label: '🏅 합격자 TIL 모아보기' },
                                    { id: 'FOLLOWING', label: '👀 팔로잉 새 글' }
                                ].map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => setActiveFilter(filter.id as any)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium text-sm flex items-center justify-between
                                            ${activeFilter === filter.id
                                                ? 'bg-slate-100 text-indigo-700 font-bold border border-indigo-100' 
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                                    >
                                        <span>{filter.label}</span>
                                        {activeFilter === filter.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. 태그 */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-700 text-sm uppercase tracking-wider">
                                <Hash className="w-4 h-4" /> 태그 탐색
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <button key={tag} onClick={() => { setSearchOption('TAG'); setSearchQuery(tag); }} 
                                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm border border-slate-200 transition-colors font-medium">
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* --- Main Feed --- */}
                    <main className="flex-1 w-full mx-auto space-y-6">
                        {tils.length === 0 && !loading ? (
                            <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
                                조건에 맞는 TIL이 없습니다.
                            </div>
                        ) : (
                            <>
                                {/* Masonry Layout */}
                                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                                {tils.map((til, i) => (
                                    <TILCard key={til.tilId} til={til} index={i} gradients={gradients} />
                                ))}
                                </div>
                            </>
                        )}

                        {/* Infinite Scroll Trigger */}
                        {hasMore && (
                            <div ref={loadMoreRef} className="py-8 text-center h-10">
                                {loading && (
                                    <div className="inline-block w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Top Button */}
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

// --- Sub Component: TIL Card ---
const TILCard = ({ til, index, gradients }: { til: TILItem, index: number, gradients: string[] }) => {
    const navigate = useNavigate();
    const [comments] = useState<Comment[]>([
        { id: '1', author: '스터디원1', content: '오 저도 이거 궁금했는데 정리 감사합니다!', createdAt: '방금 전' },
        { id: '2', author: '멘토님', content: '결론 부분 인사이트가 좋네요.', createdAt: '1시간 전' }
    ]); 

    const lineClampClass = index % 3 === 0 ? "line-clamp-4" : "line-clamp-2";
    const gradientClass = gradients[index % gradients.length];

    // 직무 아이콘 선택 (랜덤)
    const getCategoryIcon = () => {
        const icons = [
            <Code2 size={40} strokeWidth={1.5} />,
            <PenTool size={40} strokeWidth={1.5} />,
            <Briefcase size={40} strokeWidth={1.5} />,
            <Bookmark size={40} strokeWidth={1.5} />
        ];
        return icons[index % icons.length];
    };

    // 시간 포맷
    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}일 전`;
        if (hours > 0) return `${hours}시간 전`;
        return '방금 전';
    };

    // Extract first image from markdown content
    const getFirstImage = (content: string) => {
        if (!content) return null;
        const match = content.match(/!\[.*?\]\((.*?)\)/);
        return match ? match[1] : null;
    };

    const thumbnailImage = getFirstImage(til.content);

    return (
        <article 
            className="group break-inside-avoid-column bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative cursor-pointer"
            onClick={() => {
                console.log('[TILCard] Clicked TIL:', til);
                console.log('[TILCard] tilId:', til.tilId);
                if (til.tilId) {
                    navigate(`/til/${til.tilId}`);
                } else {
                    console.error('[TILCard] Missing tilId!', til);
                }
            }}
        >
            
            {/* Header: 작성자 & 메뉴 */}
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100 relative">
                        {til.author.img ? (
                            <img src={til.author.img} alt={til.author.name} className="w-full h-full object-cover" />
                        ) : (
                            <User size={16} className="text-slate-400" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <p className="font-bold text-slate-800 text-sm">{til.author.name}</p>
                            {til.author.companyName && (
                                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1 rounded">{til.author.companyName}</span>
                            )}
                        </div>
                        <p className="text-[11px] text-slate-500">{getTimeAgo(til.createdAt)}</p>
                    </div>
                </div>
                
                {/* 신고하기 메뉴 */}
                <div className="relative group/menu">
                    <button className="text-slate-300 hover:text-slate-600 transition-colors p-1">
                        <MoreHorizontal size={18} />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-24 bg-white border border-slate-100 rounded-lg shadow-lg opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                        <button className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 flex items-center gap-2">
                            <Flag size={12} /> 신고하기
                        </button>
                    </div>
                </div>
            </div>

            {/* Thumbnail */}
            <div className="px-5 pb-2">
                {thumbnailImage ? (
                    <div className="w-full h-48 rounded-2xl overflow-hidden relative group-hover:opacity-95 transition-opacity bg-slate-100">
                        <img 
                            src={thumbnailImage} 
                            alt={til.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback to gradient if image fails to load
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }} 
                        />
                        {/* Fallback Gradient (Hidden by default, shown on error) */}
                        <div className={`hidden w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center relative`}>
                             <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/60 to-transparent"></div>
                            <div className="relative z-10 text-center px-4 flex flex-col items-center gap-2">
                                <span className="text-slate-700/60">{getCategoryIcon()}</span>
                                <span className="inline-block px-2 py-1 bg-white/50 backdrop-blur-sm rounded-md text-[10px] font-bold text-slate-700">TODAY I LEARNED</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={`w-full h-48 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center relative overflow-hidden group-hover:opacity-95 transition-opacity`}>
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/60 to-transparent"></div>
                        <div className="relative z-10 text-center px-4 flex flex-col items-center gap-2">
                            <span className="text-slate-700/60">
                                {getCategoryIcon()}
                            </span>
                            <span className="inline-block px-2 py-1 bg-white/50 backdrop-blur-sm rounded-md text-[10px] font-bold text-slate-700">
                                TODAY I LEARNED
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                {til.tags && til.tags.length > 0 && (
                    <div className="flex gap-2 mb-2.5 flex-wrap">
                        {til.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[11px] font-medium rounded-full">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <h3 className="font-bold text-lg text-slate-900 mb-2.5 leading-snug">
                    {til.title}
                </h3>
                
                <p className={`text-slate-600 text-sm leading-relaxed mb-5 ${lineClampClass}`}>
                    {til.content}
                </p>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-slate-400 text-xs font-medium relative">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1.5">
                            <Heart size={16} /> 
                            {til.reaction?.length || 0}
                        </span>

                        <span className="flex items-center gap-1.5">
                            <MessageCircle size={16} /> 
                            {til.commentCount || 0}
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <span className="flex items-center gap-1"><Eye size={16} /> {til.view}</span>
                        <button className="hover:text-slate-600"><Share2 size={16} /></button>
                    </div>
                </div>


            </div>
        </article>
    );
};

export default TILPage;
