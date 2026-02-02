import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTils } from '../api/til';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Search,
  Filter,
  Hash,
  MessageCircle,
  Heart,
  Eye,
  FileText,
  PenTool,
  Edit3,
  User,
} from 'lucide-react';

// --- Types ---
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

const PAGE_SIZE = 10;

const TILPage = () => {
  const navigate = useNavigate();

  // --- Auth Guard (develop-frontend) ---
  const auth = useAuth() as any;
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const authLoading = auth?.loading ?? true;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/', {
        replace: true,
        state: {
          showToast: true,
          toastMessage: '로그인이 필요한 서비스입니다. 로그인 후 이용해주세요.',
          toastType: 'error',
        },
      });
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (!authLoading && !isAuthenticated) return null;

  // --- Server-side Filters (develop-frontend style) ---
  const [authorStatus, setAuthorStatus] = useState<string>(''); // '' | 'passed' | 'default'
  const [tagsInput, setTagsInput] = useState<string>(''); // comma-separated
  const [authorId, setAuthorId] = useState<string>(''); // optional (string input)

  // --- Client-side Search (UI only; does not affect API to avoid loops) ---
  const [searchQuery, setSearchQuery] = useState<string>('');

  // --- Data State ---
  const [tils, setTils] = useState<TILItem[]>([]);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- Refs for production-safe infinite scroll (HEAD logic) ---
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const pageRef = useRef<number>(0);
  const hasMoreRef = useRef<boolean>(true);

  // Keep refs synced
  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Filter refs to avoid stale closure inside fetch callback
  const authorStatusRef = useRef(authorStatus);
  const tagsInputRef = useRef(tagsInput);
  const authorIdRef = useRef(authorId);

  useEffect(() => {
    authorStatusRef.current = authorStatus;
    tagsInputRef.current = tagsInput;
    authorIdRef.current = authorId;
  }, [authorStatus, tagsInput, authorId]);

  // --- Client-side filtered view (search only) ---
  const filteredTils = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tils;
    return tils.filter((t) => {
      const hay = `${t.title ?? ''} ${t.content ?? ''} ${t.author?.name ?? ''} ${(t.tags ?? []).join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }, [tils, searchQuery]);

  // --- Core Fetch (HEAD 안정화 로직 + develop-frontend 파라미터) ---
  const fetchTILs = useCallback(async (pageNum: number, reset: boolean) => {
    if (isFetchingRef.current) {
      console.log('[FETCH] BLOCKED - already fetching');
      return;
    }
    isFetchingRef.current = true;

    // Cancel previous request
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    console.log('[FETCH] start page=', pageNum, 'reset=', reset);

    try {
      const params: any = {
        page: pageNum,
        size: PAGE_SIZE,
        communityCode: 0,
        signal: controller.signal,
      };

      // server-side filters
      if (authorStatusRef.current) params.authorStatus = authorStatusRef.current;
      if (tagsInputRef.current.trim()) params.tags = tagsInputRef.current.trim();
      if (authorIdRef.current.trim()) params.authorId = Number(authorIdRef.current.trim());

      const response = await getTils(params);

      // Robust response parsing
      const data = response?.data ?? response;
      let items: TILItem[] = [];

      if (data?.items) items = data.items;
      else if (data?.data?.items) items = data.data.items;
      else if (Array.isArray(data)) items = data;
      else if (Array.isArray(data?.data)) items = data.data;

      // Determine hasMore
      let computedHasMore = false;
      if (data?.hasNext !== undefined) computedHasMore = !!data.hasNext;
      else if (data?.pageInfo?.hasNext !== undefined) computedHasMore = !!data.pageInfo.hasNext;
      else if (data?.data?.hasNext !== undefined) computedHasMore = !!data.data.hasNext;
      else if (data?.data?.pageInfo?.hasNext !== undefined) computedHasMore = !!data.data.pageInfo.hasNext;
      else computedHasMore = items.length === PAGE_SIZE;

      setHasMore(computedHasMore);

      if (reset) setTils(items);
      else setTils((prev) => [...prev, ...items]);

      console.log('[FETCH] end page=', pageNum, 'received=', items.length, 'nextHasMore=', computedHasMore);
    } catch (e: any) {
      if (e?.name === 'CanceledError' || e?.name === 'AbortError' || e?.code === 'ERR_CANCELED') return;
      console.error('[FETCH] ERROR:', e);
      setError('Failed to load TILs. Please try again.');
      if (reset) {
        setTils([]);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // --- Initial load + filter change reset ---
  useEffect(() => {
    // Reset state first
    setPage(0);
    setTils([]);
    setHasMore(true);

    // Fetch first page
    fetchTILs(0, true);

    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
    // fetchTILs is stable (empty deps), filters are handled via refs
  }, [authorStatus, tagsInput, authorId, fetchTILs]);

  // --- Fetch when page increments (except initial, already fetched by reset effect) ---
  useEffect(() => {
    if (page === 0) return;
    fetchTILs(page, false);
  }, [page, fetchTILs]);

  // --- Production-safe IntersectionObserver (HEAD) ---
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

        // Unobserve immediately to prevent repeated triggers while sentinel stays visible
        if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);

        setPage((prev) => prev + 1);
      },
      { root: null, threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(loadMoreRef.current);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, []);

  // Re-observe when ready for next page
  useEffect(() => {
    if (!observerRef.current || !loadMoreRef.current) return;
    if (hasMore && !isFetchingRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
  }, [hasMore, tils.length]);

  // --- UI helpers (minimal) ---
  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar (Sticky) */}
        <aside className="hidden lg:block w-80 shrink-0 sticky top-28 h-fit space-y-6">
          {/* Header */}
          <div className="px-2">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Knowledge
            </h2>
            <p className="text-slate-500 text-sm">합격자들의 인사이트와 노하우를 확인하세요.</p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-700">
              <Filter className="w-4 h-4" /> 보기 옵션
            </h3>
            <div className="space-y-2">
              {[
                { value: '', label: '전체 보기', icon: BookOpen },
                { value: 'passed', label: '합격자 노트', icon: FileText },
                { value: 'default', label: '일반 노트', icon: Edit3 },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setAuthorStatus(f.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${
                    authorStatus === f.value
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <f.icon className={`w-4 h-4 ${authorStatus === f.value ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {f.label}
                </button>
              ))}
            </div>

            {/* Optional authorId */}
            <div className="mt-4">
              <label className="text-xs text-slate-500">작성자 ID(선택)</label>
              <input
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                placeholder="예: 12"
                className="mt-1 w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-sm transition-all"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-700">
              <Hash className="w-4 h-4" /> 태그 검색
            </h3>
            <input
              type="text"
              placeholder="예: 면접후기, 자소서팁"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 text-sm transition-all"
            />
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
              <span>추천:</span>
              <button onClick={() => setTagsInput('면접후기')} className="hover:text-indigo-600 underline">
                #면접후기
              </button>
              <button onClick={() => setTagsInput('합격꿀팁')} className="hover:text-indigo-600 underline">
                #합격꿀팁
              </button>
              <button onClick={() => setTagsInput('직무분석')} className="hover:text-indigo-600 underline">
                #직무분석
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 w-full max-w-3xl mx-auto space-y-6">
          {/* Mobile Search */}
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

          {/* Desktop Search */}
          <div className="hidden lg:block bg-white p-2 rounded-2xl mb-8 sticky top-30 z-20 border border-slate-200 shadow-sm">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="제목/내용/태그/작성자 검색(클라이언트 필터)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none text-base"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => fetchTILs(0, true)}
                className="px-3 py-1 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                재시도
              </button>
            </div>
          )}

          {/* Loading initial */}
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
          ) : (
            <div className="w-full pb-10 space-y-6">
              {filteredTils.map((til, i) => (
                <article
                  key={til.tilId ?? i}
                  onClick={() => navigate(`/til/${til.tilId}`)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div className="p-6 md:p-8">
                    {/* Author */}
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

                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-tight">
                      {til.title || '제목 없음'}
                    </h3>

                    <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {til.content || '내용이 없습니다.'}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-wrap gap-2 text-xs">
                        {(til.tags ?? []).slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-medium group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-slate-400 text-xs">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5" />
                          {til.reaction?.length ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {til.commentCount ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {til.view ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Infinite Scroll Sentinel */}
          {hasMore && (
            <div ref={loadMoreRef} className="py-8 text-center h-10">
              {loading && (
                <div className="inline-block w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
              )}
            </div>
          )}

          {!hasMore && tils.length > 0 && (
            <div className="py-10 text-center text-sm text-slate-400">
              마지막 페이지입니다.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TILPage;
