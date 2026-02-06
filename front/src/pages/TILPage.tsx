import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTils } from '../api/til';
import { getUserProfile, getUserStreak, getFollowers, getFollowees, followUser, unfollowUser } from '../api/user'; // Added getUserStreak
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { stripMarkdown } from '../utils/textUtils';
import {
    BookOpen, Search, Filter, Hash, MessageCircle, User,
    Heart, PenTool, FileText, Edit3, ArrowUp, Code2, Briefcase, Bookmark, X, ChevronRight
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
    const [tagsList, setTagsList] = useState<string[]>([]); // Changed to array for chips
    const [tagInput, setTagInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [authorNameQuery, setAuthorNameQuery] = useState(''); // New Author Name Filter

    // User Profile Data (Fetched from API)
    const [userProfile, setUserProfile] = useState<any>(null);
    const [userStreak, setUserStreak] = useState<number>(0);

    // --- Follow Modal State ---
    type FollowType = 'FOLLOWER' | 'FOLLOWING';
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [followModalType, setFollowModalType] = useState<FollowType>('FOLLOWER');
    const [followList, setFollowList] = useState<any[]>([]);

    // Fetch User Profile & Streak
    useEffect(() => {
        if (user?.accountId) {
            getUserProfile(user.accountId)
                .then(data => setUserProfile(data))
                .catch(err => console.error("Failed to fetch user profile", err));

            getUserStreak(user.accountId)
                .then(data => {
                    // Assuming data.streakData.currentStreak based on api/user.ts comments
                    // Safety check: data might be just array or object
                    if (data?.streakData?.currentStreak !== undefined) {
                        setUserStreak(data.streakData.currentStreak);
                    } else {
                        setUserStreak(0);
                    }
                })
                .catch(err => console.error("Failed to fetch user streak", err));
        }
    }, [user?.accountId]);

    // --- Follow Logic ---
    const openFollowModal = async (type: FollowType) => {
        if (!user?.accountId) return;
        setFollowModalType(type);
        setFollowList([]);
        setIsFollowModalOpen(true);
        try {
            const fetcher = type === 'FOLLOWER' ? getFollowers : getFollowees;
            const data = await fetcher(user.accountId);
            setFollowList(data || []);
        } catch (error) {
            console.error(`Failed to fetch ${type}`, error);
            setFollowList([]);
        }
    };

    const toggleFollow = async (id: number) => {
        if (!user?.accountId) return;

        const targetUser = followList.find(u => u.id === id);
        if (!targetUser) return;

        try {
            if (targetUser.isFollowing) {
                await unfollowUser(user.accountId, id);
                setUserProfile((prev: any) => prev ? { ...prev, followeeCount: Math.max(0, (prev.followeeCount || 0) - 1) } : null);
            } else {
                await followUser(user.accountId, id);
                setUserProfile((prev: any) => prev ? { ...prev, followeeCount: (prev.followeeCount || 0) + 1 } : null);
            }
            setFollowList(prev => prev.map(u =>
                u.id === id ? { ...u, isFollowing: !u.isFollowing } : u
            ));
        } catch (error) {
            console.error('Failed to toggle follow:', error);
        }
    };

    // Debounced Values
    const debouncedSearch = useDebounce(searchQuery, 300);
    const debouncedAuthorName = useDebounce(authorNameQuery, 300);

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
    const tagsRef = useRef(tagsList);
    const searchRef = useRef(debouncedSearch);
    const authorNameRef = useRef(debouncedAuthorName);

    // Sync Refs
    useEffect(() => { pageRef.current = page; }, [page]);
    useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
    useEffect(() => { authorStatusRef.current = authorStatus; }, [authorStatus]);
    useEffect(() => { tagsRef.current = tagsList; }, [tagsList]);
    useEffect(() => { searchRef.current = debouncedSearch; }, [debouncedSearch]);
    useEffect(() => { authorNameRef.current = debouncedAuthorName; }, [debouncedAuthorName]);

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

            // Apply Filters
            // if (authorStatusRef.current) {
            //     params.authorStatus = authorStatusRef.current;
            // }
            if (tagsRef.current && tagsRef.current.length > 0) {
                params.tags = tagsRef.current.join(','); // Join with comma
            }
            if (searchRef.current) {
                params.searchKeyword = searchRef.current; // Updated param name
            }
            if (authorNameRef.current) {
                params.authorName = authorNameRef.current; // New param
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
    // 1. Filter Changes -> Reset & Fetch (Debounced)
    useEffect(() => {
        // Explicitly sync refs here before fetching to avoid race conditions with batched updates
        tagsRef.current = tagsList;
        searchRef.current = debouncedSearch;
        authorNameRef.current = debouncedAuthorName;
        // authorStatusRef.current = authorStatus; // No longer needed for API

        // Reset state
        setPage(0);
        setTils([]);
        setHasMore(true);
        // Fetch page 0
        fetchTILs(0, true);
    }, [tagsList, debouncedSearch, debouncedAuthorName, fetchTILs]); // Removed authorStatus from deps

    // Tag Handlers
    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tagsList.includes(newTag)) {
                setTagsList([...tagsList, newTag]);
                setTagInput('');
            }
        } else if (e.key === 'Backspace' && !tagInput && tagsList.length > 0) {
            setTagsList(prev => prev.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTagsList(prev => prev.filter(t => t !== tagToRemove));
    };

    const addTag = (tag: string) => {
        if (!tagsList.includes(tag)) {
            setTagsList([...tagsList, tag]);
        }
    };

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
            <div className="max-w-7xl mx-auto mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Today I Learned</h2>
                <p className="text-slate-500 mt-2">매일 배운 것을 기록하고 공유하세요</p>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Left Sidebar (Sticky) */}
                <aside className="hidden lg:block w-72 shrink-0 sticky top-8 h-fit space-y-6">
                    {/* User Profile Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full p-1 mb-3 relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full animate-spin-slow opacity-75 blur-sm group-hover:opacity-100 transition-opacity"></div>
                            {userProfile?.img && userProfile?.img !== 'default_img.png' ? (
                                <img
                                    src={userProfile.img}
                                    alt={userProfile.name}
                                    className="w-full h-full rounded-full bg-slate-100 relative z-10 object-cover border-2 border-white"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/default-profile.jpg'; }}
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-slate-100 relative z-10 flex items-center justify-center border-2 border-white">
                                    <User className="w-8 h-8 text-slate-400" />
                                </div>
                            )}
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">{userProfile?.name || user?.name || 'Guest'}</h3>
                        <p className="text-slate-500 text-xs mb-6">{userProfile?.email || user?.email || 'Start your journey'}</p>

                        {/* Stats - using fetched profile data */}
                        <div className="w-full grid grid-cols-3 gap-2 text-center py-4 border-t border-slate-100 mb-4">
                            <div className="flex flex-col cursor-pointer" onClick={() => openFollowModal('FOLLOWER')}>
                                <span className="text-xs text-slate-400 mb-1">Followers</span>
                                <span className="text-sm font-bold text-slate-800">{userProfile?.followerCount || 0}</span>
                            </div>
                            <div className="flex flex-col border-l border-slate-100 cursor-pointer" onClick={() => openFollowModal('FOLLOWING')}>
                                <span className="text-xs text-slate-400 mb-1">Following</span>
                                <span className="text-sm font-bold text-slate-800">{userProfile?.followeeCount || 0}</span>
                            </div>
                            <div className="flex flex-col border-l border-slate-100">
                                <span className="text-xs text-slate-400 mb-1">Streak</span>
                                <span className="text-sm font-bold text-slate-800">🔥 {userStreak}</span>
                            </div>
                        </div>

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
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap h-8 ${authorStatus === f.value
                                                ? 'bg-white text-indigo-600 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        <f.icon className="w-3.5 h-3.5" />
                                        {f.label}
                                    </button>
                                ))}
                            </div>

                            {/* Search Fields Wrapper - Layout Updated */}
                            <div className="flex-1 flex flex-col gap-3">
                                <div className="flex flex-col xl:flex-row gap-3">
                                    {/* Tag Input (Chips) - Full width on mobile/tablet, resizable on xl */}
                                    <div className="relative shrink-0 flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 flex items-center min-h-[40px] focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all">
                                        <Hash className="text-slate-400 w-4 h-4 shrink-0 mr-2" />
                                        <div className="flex flex-wrap gap-1 flex-1 py-1">
                                            {tagsList.map(tag => (
                                                <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-bold">
                                                    {tag}
                                                    <button onClick={() => removeTag(tag)} className="hover:text-indigo-800">×</button>
                                                </span>
                                            ))}
                                            <input
                                                type="text"
                                                placeholder={tagsList.length === 0 ? "태그 검색 (엔터)..." : ""}
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={handleTagKeyDown}
                                                className="bg-transparent text-sm outline-none min-w-[60px] flex-1 text-slate-800 placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    {/* Author Name Filter */}
                                    <div className="relative shrink-0 xl:w-48">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="작성자 검색..."
                                            value={authorNameQuery}
                                            onChange={(e) => setAuthorNameQuery(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-800 h-10"
                                        />
                                    </div>
                                </div>

                                {/* Keyword Search Input - New Row */}
                                <div className="relative w-full">
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
                                        onClick={() => addTag(tagName)}
                                        className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all border ${tagsList.includes(tagName)
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
                    ) : tils.filter(til => {
                        if (authorStatus === 'passed') return !!til.author?.companyName;
                        if (authorStatus === 'default') return !til.author?.companyName;
                        return true;
                    }).length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm border-dashed">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">검색 결과가 없습니다.</p>
                            <p className="text-sm text-slate-400 mt-1">다른 키워드로 검색해보세요.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tils.filter(til => {
                                if (authorStatus === 'passed') return !!til.author?.companyName;
                                if (authorStatus === 'default') return !til.author?.companyName;
                                return true;
                            }).map((til, i) => (
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

            {/* Mobile Write FAB (lg:hidden) */}
            <button
                onClick={() => navigate('/til/write')}
                className="fixed bottom-8 right-8 lg:hidden bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all z-40 flex items-center justify-center"
                aria-label="TIL 작성하기"
            >
                <PenTool className="w-6 h-6" />
            </button>

            {/* Scroll Top Button - Adjusted position on mobile to avoid FAB overlap */}
            <button
                onClick={scrollToTop}
                className={`fixed right-8 bg-slate-900 text-white p-3 rounded-full shadow-lg hover:bg-slate-800 transition-all z-30 ${showTopBtn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                    } bottom-24 lg:bottom-8`} // Mobile: bottom-24, Desktop: bottom-8
            >
                <ArrowUp size={24} />
            </button>

            {/* --- Follow Modal --- */}
            {isFollowModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100">
                            <div className="w-8"></div>
                            <h3 className="font-bold text-lg text-slate-800">
                                {followModalType === 'FOLLOWER' ? '팔로워' : '팔로잉'}
                            </h3>
                            <button onClick={() => setIsFollowModalOpen(false)} className="w-8 flex justify-end text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-2">
                            {followList.length > 0 ? followList.map(followUser => (
                                <div
                                    key={followUser.id}
                                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer"
                                    onClick={() => {
                                        navigate(`/users/${followUser.id}`);
                                        setIsFollowModalOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                            <img
                                                src={(followUser.profileImage && followUser.profileImage.trim() && followUser.profileImage !== 'default_img.png') ? followUser.profileImage : '/default-profile.jpg'}
                                                alt={followUser.nickname}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).src = '/default-profile.jpg'; }}
                                            />
                                        </div>
                                        <span className="font-medium text-slate-700">{followUser.nickname}</span>
                                    </div>
                                    {/* Show follow button only if it's not me */}
                                    {user?.accountId !== followUser.id && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent navigation when clicking button
                                                toggleFollow(followUser.id);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${followUser.isFollowing
                                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                }`}
                                        >
                                            {followUser.isFollowing ? '팔로잉' : '팔로우'}
                                        </button>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center py-10 text-slate-400">
                                    {followModalType === 'FOLLOWER' ? '팔로워가 없습니다.' : '팔로잉하는 사용자가 없습니다.'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
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
                            <span className="text-sm font-semibold text-slate-700">
                                {til.author?.name}
                            </span>
                            {til.author?.companyName ? (
                                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold border border-indigo-100">합격자</span>
                            ) : (
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-bold border border-slate-200">일반</span>
                            )}
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
