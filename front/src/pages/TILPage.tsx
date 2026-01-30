import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { communityApi, TILItem } from '../api/mock/community';
import { Search, Filter, Hash, ThumbsUp, MessageCircle, MoreHorizontal, X, Code2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import './TILPage.css';

gsap.registerPlugin(Flip);

const TILPage = () => {
    const navigate = useNavigate();
    const [tils, setTils] = useState<TILItem[]>([]);
    const [filteredTils, setFilteredTils] = useState<TILItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    // Animation State
    const [selectedTIL, setSelectedTIL] = useState<TILItem | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const gridItemsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Details Refs
    const detailsRef = useRef<HTMLDivElement>(null);
    const detailsBgDownRef = useRef<HTMLDivElement>(null);
    const detailsVisualRef = useRef<HTMLDivElement>(null);
    const detailsContentRef = useRef<HTMLDivElement>(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    // Sidebar Tags (Mock)
    const popularTags = ['React', 'TypeScript', 'Next.js', 'Algorithm', 'CS', 'Interview'];

    useEffect(() => {
        const fetchTILs = async () => {
            setTimeout(async () => {
                try {
                    const data = await communityApi.getTILs();
                    // Duplicate for grid filling
                    const feedData = [...data, ...data, ...data, ...data].map((item, i) => ({ ...item, id: `${item.id}_${i}` }));
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
            result = result.slice(0, 4);
        }
        setFilteredTils(result);
    }, [searchQuery, activeFilter, tils]);


    // --- GSAP Flip Logic (Copied & Adapted) ---
    const handleOpen = contextSafe((til: TILItem, index: number) => {
        if (isAnimating || selectedTIL) return;
        setIsAnimating(true);
        setSelectedTIL(til);

        const gridItem = gridItemsRef.current[index];
        if (!gridItem || !detailsRef.current || !detailsBgDownRef.current || !detailsVisualRef.current) return;

        // TARGETS:
        // .product__bg -> White Card
        // .product__visual -> Code Block
        const productBg = gridItem.querySelector('.product__bg');
        const productVisual = gridItem.querySelector('.product__visual');

        // 1. Initial State: Hide Grid Item parts
        gsap.set([productBg, productVisual], { autoAlpha: 0 });

        // 2. Prepare Details View
        gsap.set(detailsRef.current, { visibility: 'visible' });
        gsap.set(detailsRef.current.querySelector('.details__bg--up'), { opacity: 1 });

        // 3. FLIP Magic
        Flip.fit(detailsBgDownRef.current, productBg as Element, { scale: true });
        Flip.fit(detailsVisualRef.current, productVisual as Element, { scale: true });

        const state = Flip.getState([detailsBgDownRef.current, detailsVisualRef.current]);

        gsap.set([detailsBgDownRef.current, detailsVisualRef.current], { clearProps: "all" });
        gsap.set([detailsBgDownRef.current, detailsVisualRef.current], { opacity: 1, visibility: 'visible' });

        Flip.from(state, {
            duration: 0.6,
            ease: "power3.inOut",
            scale: true,
            onComplete: () => setIsAnimating(false)
        });

        // Animate Content In
        gsap.fromTo(
            detailsContentRef.current?.children || [],
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.3, ease: "power2.out" }
        );

        gsap.fromTo('.details__close',
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.4, delay: 0.5, ease: "back.out(1.7)" }
        );
    });

    const handleClose = contextSafe(() => {
        if (isAnimating || !selectedTIL) return;
        setIsAnimating(true);

        const index = filteredTils.findIndex(t => t.id === selectedTIL.id);
        const gridItem = gridItemsRef.current[index];
        if (!gridItem || !detailsRef.current || !detailsBgDownRef.current || !detailsVisualRef.current) return;

        const productBg = gridItem.querySelector('.product__bg');
        const productVisual = gridItem.querySelector('.product__visual');

        gsap.to(detailsContentRef.current?.children || [], {
            y: 50,
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.in"
        });

        gsap.to('.details__close', { opacity: 0, duration: 0.2 });

        const state = Flip.getState([detailsBgDownRef.current, detailsVisualRef.current]);

        Flip.fit(detailsBgDownRef.current, productBg as Element, { scale: true });
        Flip.fit(detailsVisualRef.current, productVisual as Element, { scale: true });

        Flip.from(state, {
            duration: 0.6,
            ease: "power3.inOut",
            scale: true,
            onComplete: () => {
                if (detailsRef.current) {
                    gsap.set(detailsRef.current, { visibility: 'hidden' });
                    gsap.set(detailsRef.current.querySelector('.details__bg--up'), { opacity: 0 });
                }

                // Show Grid Item again
                gsap.set([productBg, productVisual], { autoAlpha: 1 });

                // Reset Details Styles
                gsap.set([detailsBgDownRef.current, detailsVisualRef.current], { clearProps: "all" });

                setSelectedTIL(null);
                setIsAnimating(false);
            }
        });
    });


    return (
        <div className="min-h-screen text-white pt-28 pb-20 px-4 md:px-8 til-page-container" ref={containerRef}>
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Left Sidebar (Sticky) - Kept as is */}
                <aside className="hidden lg:block w-80 shrink-0 sticky top-28 h-fit space-y-8 z-10">
                    {/* ... Sidebar Content ... */}
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
                <main className="flex-1 w-full">

                    {/* Search Bar - Kept as is */}
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
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-slate-500">Loading TILs...</div>
                    ) : filteredTils.length === 0 ? (
                        <div className="text-center py-20 text-slate-500">No TILs found.</div>
                    ) : (
                        // Changed to Grid Layout (1 Col Mobile, 2 Col Desktop)
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                            {filteredTils.map((til, index) => (
                                <div
                                    key={til.id}
                                    ref={el => { gridItemsRef.current[index] = el; }}
                                    className="flex justify-center" // Centering wrapper
                                >
                                    {/* The Card */}
                                    <div
                                        className="w-full bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-2 group product product__bg"
                                        onClick={() => handleOpen(til, index)}
                                        style={{ maxWidth: '100%' }}
                                    >
                                        {/* 1. Header: User Info */}
                                        <div className="bg-slate-50 p-5 border-b border-slate-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={til.author.profileImage} alt={til.author.nickname} className="w-10 h-10 rounded-full bg-slate-200 object-cover" />
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{til.author.nickname}</p>
                                                    <p className="text-xs text-slate-500">{new Date(til.date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <button className="text-slate-400 hover:text-slate-600">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>

                                        {/* 2. Body: Content */}
                                        <div className="p-5 bg-white relative">
                                            {/* Code Block Visual (.product__visual) */}
                                            <div className="product__visual bg-slate-900 rounded-xl p-4 mb-4 relative overflow-hidden group-hover:shadow-lg transition-shadow">
                                                {/* Window Controls */}
                                                <div className="flex gap-1.5 mb-3">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                                </div>
                                                {/* Code Skeleton */}
                                                <div className="space-y-2 opacity-60">
                                                    <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
                                                    <div className="h-2 w-1/2 bg-slate-700 rounded"></div>
                                                    <div className="h-2 w-2/3 bg-slate-700 rounded"></div>
                                                </div>
                                                {/* Center Icon */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Code2 className="text-white/20 w-12 h-12 group-hover:text-white/40 transition-colors transform group-hover:scale-110 duration-500" />
                                                </div>
                                            </div>

                                            <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                                                {til.title}
                                            </h3>
                                            <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                                {til.content}
                                            </p>

                                            <div className="flex flex-wrap gap-1.5">
                                                {til.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 3. Footer: Stats */}
                                        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs font-medium bg-white">
                                            <div className="flex gap-4">
                                                <span className="flex items-center gap-1 group-hover:text-rose-500 transition-colors">
                                                    <ThumbsUp size={14} /> {til.reactions}
                                                </span>
                                                <span className="flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                                                    <MessageCircle size={14} /> {til.commentsCount || 0}
                                                </span>
                                            </div>
                                            <span>Read more</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* DETAILS OVERLAY */}
            <div className="details" ref={detailsRef}>
                {/* 1. White BG Fade In */}
                <div className="details__bg details__bg--up"></div>

                {/* 2. Expanding Card BG */}
                <div
                    className="details__bg details__bg--down bg-white rounded-none"
                    ref={detailsBgDownRef}
                    style={{ border: 'none', background: '#fff' }}
                ></div>

                {/* 3. Hero Visual (Code Block) */}
                <div
                    className="details__visual bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
                    ref={detailsVisualRef}
                >
                    <div className="absolute top-6 left-6 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <Code2 className="text-white/10 w-32 h-32" />
                </div>

                {/* 4. Content Content */}
                <div className="details__content" ref={detailsContentRef}>
                    {selectedTIL && (
                        <>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                                {selectedTIL.title}
                            </h2>

                            <div className="flex items-center gap-4 mb-10">
                                <img src={selectedTIL.author.profileImage} className="w-12 h-12 rounded-full bg-slate-200" alt="Author" />
                                <div>
                                    <p className="font-bold text-lg text-slate-800">{selectedTIL.author.nickname}</p>
                                    <p className="text-sm text-slate-500">{new Date(selectedTIL.date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="prose prose-lg prose-slate max-w-none text-slate-600 mb-12">
                                <p className="whitespace-pre-line text-lg leading-relaxed">
                                    {selectedTIL.content}
                                </p>
                                <p>
                                    (더 많은 본문 내용이 여기에 들어갑니다. 마크다운 렌더링 등을 적용할 수 있습니다.)
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>

                            <div className="flex gap-2 mb-8">
                                {selectedTIL.tags.map(tag => (
                                    <span key={tag} className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full font-medium text-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="border-t border-slate-200 pt-8 flex gap-4">
                                <button className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors">
                                    <ThumbsUp size={20} /> Like {selectedTIL.reactions}
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">
                                    <MessageCircle size={20} /> Comment
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <button className="details__close" onClick={handleClose}>
                    <X size={32} />
                </button>
            </div>

        </div>
    );
};

export default TILPage;
