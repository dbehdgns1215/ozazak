import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTils } from '../api/til';
import { useAuth } from '../context/AuthContext';
import {
    BookOpen, Search, Filter, Hash, MessageCircle, User,
    Heart, Eye, FileText, PenTool, ChevronRight, Edit3
} from 'lucide-react';

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
    const rightCardsRef = useRef<HTMLElement[]>([]);

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
        <div className="min-h-screen bg-slate-50 text-slate-800 pt-28 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Left Sidebar (Sticky) */}
                <aside className="hidden lg:block w-80 shrink-0 sticky top-28 h-fit space-y-6">

                    {/* Header Text */}
                    <div className="px-2">
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                            <BookOpen className="w-6 h-6 text-indigo-600" />
                            Knowledge
                        </h2>
                        <p className="text-slate-500 text-sm">합격자들의 인사이트와 노하우를 확인하세요.</p>
                    </div>

                    {/* Filters Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-700">
                            <Filter className="w-4 h-4" /> 보기 옵션
                        </h3>
                        <div className="space-y-2">
                            {[
                                { value: '', label: '전체 보기', icon: BookOpen },
                                { value: 'passed', label: '합격자 노트', icon: FileText },
                                { value: 'default', label: '일반 노트', icon: Edit3 }
                            ].map(f => (
                                <button
                                    key={f.value}
                                    onClick={() => setAuthorStatus(f.value)}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${authorStatus === f.value
                                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                        }`}
                                >
                                    <f.icon className={`w-4 h-4 ${authorStatus === f.value ? 'text-indigo-600' : 'text-slate-400'}`} />
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tags Filter Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-700">
                            <Hash className="w-4 h-4" /> 태그 검색
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="예: 면접후기, 자소서팁"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-sm transition-all"
                            />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                            <span>추천:</span>
                            <button onClick={() => setTagsInput('면접후기')} className="hover:text-indigo-600 underline">#면접후기</button>
                            <button onClick={() => setTagsInput('합격꿀팁')} className="hover:text-indigo-600 underline">#합격꿀팁</button>
                            <button onClick={() => setTagsInput('직무분석')} className="hover:text-indigo-600 underline">#직무분석</button>
                        </div>
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="flex-1 w-full max-w-3xl mx-auto space-y-6">

                    {/* Mobile Search & Header */}
                    <div className="lg:hidden mb-6 space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">Knowledge Feed</h2>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="관심있는 주제를 검색해보세요"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden lg:block bg-white p-2 rounded-2xl mb-8 sticky top-30 z-20 border border-slate-200 shadow-sm">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="제목이나 내용으로 검색하세요..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none text-base"
                            />
                        </div>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm flex items-center justify-between">
                            <span>{error}</span>
                            <button
                                onClick={() => fetchTils(0, false)}
                                className="px-3 py-1 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                재시도
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {!error && loading && tils.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-indigo-600 mb-4"></div>
                            <p className="text-slate-500">지식을 불러오는 중입니다...</p>
                        </div>
                    ) : !error && filteredTils.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm border-dashed">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">검색 결과가 없습니다.</p>
                            <p className="text-sm text-slate-400 mt-1">다른 키워드로 검색해보세요.</p>
                        </div>
                    ) : !error ? (
                        <div className="w-full pb-20 space-y-6">
                            {filteredTils.map((til, i) => (
                                <article
                                    key={til.id || i}
                                    ref={el => { if (el) rightCardsRef.current[i] = el; }}
                                    onClick={() => navigate(`/til/${til.id}`)}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                                >
                                    <div className="flex flex-col md:flex-row h-full">

                                        {/* Thumbnail Area (Pastel Gradient) */}
                                        <div className={`md:w-48 shrink-0 min-h-[160px] md:min-h-full flex items-center justify-center relative overflow-hidden
                                            ${i % 3 === 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50' :
                                                i % 3 === 1 ? 'bg-gradient-to-br from-emerald-50 to-teal-50' :
                                                    'bg-gradient-to-br from-purple-50 to-pink-50'
                                            }`}
                                        >
                                            {/* Decorative Icon */}
                                            <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                                                {i % 3 === 0 ? <BookOpen className="w-10 h-10 text-indigo-300/80" /> :
                                                    i % 3 === 1 ? <PenTool className="w-10 h-10 text-teal-300/80" /> :
                                                        <FileText className="w-10 h-10 text-purple-300/80" />
                                                }
                                            </div>

                                            {/* Decorative Circle */}
                                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/40 rounded-full blur-2xl"></div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex-1 p-6 md:p-8 flex flex-col">

                                            {/* Author Info */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                                        {til.author?.img ? (
                                                            <img src={til.author.img} alt={til.author.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="w-4 h-4 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-slate-700">{til.author?.name}</span>
                                                        <span className="text-xs text-slate-400">•</span>
                                                        <span className="text-xs text-slate-500">{til.author?.companyName || '취업 준비생'}</span>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-400">{formatDate(til.createdAt)}</span>
                                            </div>

                                            {/* Title & Stats */}
                                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-tight">
                                                {til.title || '제목 없음'}
                                            </h3>

                                            <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                                                {til.content || '내용이 없습니다.'}
                                            </p>

                                            {/* Tags & Footer */}
                                            <div className="mt-auto flex items-center justify-between">
                                                <div className="flex flex-wrap gap-2 text-xs">
                                                    {til.tags && til.tags.slice(0, 2).map((tag, idx) => (
                                                        <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-medium group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-4 text-slate-400 text-xs">
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="w-3.5 h-3.5" />
                                                        {til.reactions || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MessageCircle className="w-3.5 h-3.5" />
                                                        {til.commentCount || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : null}

                    {/* Load More Button */}
                    {!loading && pageInfo?.hasNext && (
                        <div className="py-8 text-center">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-medium rounded-full hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm disabled:opacity-50"
                            >
                                {loading ? '지식 더 불러오기...' : '더 보기'}
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default TILPage;
