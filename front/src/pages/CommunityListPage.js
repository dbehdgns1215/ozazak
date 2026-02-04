import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Search, MessageSquare, ThumbsUp, Eye, PenTool, Hash, ArrowLeft, 
    BookOpen, Flame, Briefcase, FileText, Users, HelpCircle, Loader2
} from 'lucide-react';
import { getTILList, getCommunityPosts, getCommunityCategories } from '../api/community';

const CommunityListPage = () => {
    const { boardId } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const communityCode = parseInt(boardId) || 0;

    useEffect(() => {
        const fetchCategoriesAndPosts = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Categories to set the title
                const catsRes = await getCommunityCategories();
                const items = catsRes?.data?.items || catsRes?.items || [];
                
                // Filter out TIL (1) and HOT (3) for tabs display
                const filteredCats = items.filter(c => c.communityCode !== 1 && c.communityCode !== 3);
                setCategories(filteredCats);
                
                // Find current category info (even if hidden from tabs, we might be viewing it directly?)
                // If user navigates manually to /community/3, should it show? 
                // Context implies "list should show all", but if hidden, maybe we just handle title.
                const foundCat = items.find(c => c.communityCode === communityCode);
                setCurrentCategory(foundCat || { title: '커뮤니티', description: '개발자들의 소통 공간' });

                // 2. Fetch Posts based on Code
                let response;
                if (communityCode === 1) {
                    // TIL Board
                    console.log('Fetching TIL List');
                    response = await getTILList({ communityCode: 1, sort: 'createdAt,desc' });
                } else {
                    // Other Community Boards
                    console.log(`Fetching Community Posts for code ${communityCode}`);
                    // Ensure getCommunityPosts supports filtering by communityCode
                    // Assuming getCommunityPosts accepts params object
                    response = await getCommunityPosts({ communityCode: communityCode });
                }

                // Standardize Data Structure
                // TIL returns { items: [...] } or { data: [...] }
                // Community might return differently. Let's normalize.
                let postItems = [];
                if (response?.data?.items) postItems = response.data.items;
                else if (response?.items) postItems = response.items;
                else if (Array.isArray(response?.data)) postItems = response.data;
                else if (Array.isArray(response)) postItems = response;
                
                // Client-side sort: Newest first
                if (postItems && postItems.length > 0) {
                    postItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }

                setPosts(postItems);

            } catch (e) {
                console.error("Failed to load community data", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategoriesAndPosts();
    }, [communityCode]);

    const getIcon = (code) => {
        switch (code) {
            case 1: return <BookOpen className="w-6 h-6 text-emerald-500" />;
            case 2: return <MessageSquare className="w-6 h-6 text-blue-500" />;
            case 3: return <Flame className="w-6 h-6 text-orange-500" />;
            case 4: return <Briefcase className="w-6 h-6 text-purple-500" />;
            case 5: return <FileText className="w-6 h-6 text-pink-500" />;
            case 6: return <Users className="w-6 h-6 text-indigo-500" />;
            case 7: return <HelpCircle className="w-6 h-6 text-yellow-500" />;
            default: return <MessageSquare className="w-6 h-6 text-slate-400" />;
        }
    };

    // Filter Logic (Client-side Search)
    const filteredPosts = posts.filter(post => {
        const titleMatch = post.title?.toLowerCase().includes(searchQuery.toLowerCase());
        const authorMatch = (typeof post.author === 'string' ? post.author : post.author?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        return titleMatch || authorMatch;
    });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20 px-6 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <button
                    onClick={() => navigate('/community')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors font-medium text-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> 메인으로
                </button>

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                            {getIcon(communityCode)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black mb-1 text-slate-900">{currentCategory?.title || '로딩중...'}</h1>
                            <p className="text-slate-500 font-medium">{currentCategory?.description}</p>
                        </div>
                    </div>
                    <button 
                         onClick={() => {
                            if (communityCode === 1) {
                                navigate('/til/write');
                            } else {
                                navigate('/community/write'); // Should we pass state?
                                // Ideally CommunityWritePage should handle 'default category' if navigating from list
                                // Or we might need to route to /community/write/:code?
                                // For now generic write page. User might need to select category manually if not pre-filled.
                                // Let's check CommunityWritePage later if it supports pre-selection.
                            }
                        }}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                    >
                        <PenTool className="w-5 h-5" />
                        글쓰기
                    </button>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                    <button
                        onClick={() => navigate('/community')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                           !communityCode 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20' 
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        전체
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.communityCode}
                            onClick={() => navigate(cat.communityCode === 1 ? '/til' : `/community/board/${cat.communityCode}`)} // Assuming /til route exists for code 1 redirection if needed, or just /community/1 which handles it.  
                            // Actually, CommunityListPage handles code 1 as well, but specific route /til might be preferred? 
                            // The logic in this file handles code=1. Let's keep /community/1 for consistency unless /til is strictly required elsewhere.
                            // Better: navigate(`/community/${cat.communityCode}`) and let the component logic handle it. 
                            // But wait, if I stick to /community/1, does it trigger the "TIL" logic? Yes, useEffect checks communityCode.
                            
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                                communityCode === cat.communityCode
                                    ? `bg-white border-${cat.communityCode === 1 ? 'emerald' : 'indigo'}-500 text-${cat.communityCode === 1 ? 'emerald' : 'indigo'}-600 ring-1 ring-${cat.communityCode === 1 ? 'emerald' : 'indigo'}-500`
                                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            {/* Simple colored dot or icon could be nice, but keeping it simple for now */}
                            {cat.title}
                        </button>
                    ))}
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 border border-slate-200 shadow-sm relative z-10">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="제목 또는 작성자로 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Posts List */}
                <div className="space-y-4">
                    {isLoading ? (
                         <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
                            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <PenTool className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-900 font-bold text-lg mb-2">게시글이 없습니다.</p>
                            <p className="text-sm text-slate-500">첫 번째 글을 작성해보세요!</p>
                        </div>
                    ) : (
                        filteredPosts.map(post => {
                            // Normalize Author & Date
                            // TIL: author { name, img... }, createdAt
                            // CommunityPost: author might be string or obj? Check API.
                            // Assuming similar structure for now or handling both.
                            const authorName = post.author?.name || post.author?.nickname || '익명';
                            const authorImg = post.author?.img || post.author?.profileImage;
                            const date = post.createdAt || post.createdDate;
                            const postId = post.tilId || post.communityId || post.id;
                            const linkPath = communityCode === 1 ? `/til/${postId}` : `/community/post/${postId}`;
                            const commentCount = post.commentCount !== undefined ? post.commentCount : (post.comments || 0);
                            
                            // Reaction Count logic
                            let likeCount = 0;
                            if (typeof post.reaction === 'number') likeCount = post.reaction;
                            else if (Array.isArray(post.reaction)) {
                                // Sum counts? Or just show distinct count? Usually total reaction count.
                                // Or find type=1 count.
                                // Let's simplify: try to show a total or represent "Likes".
                                likeCount = post.reaction.reduce((acc, curr) => acc + (curr.count || 0), 0);
                            } else if (post.reaction && typeof post.reaction === 'object') {
                                // If object { code: 1, count: 5 }
                                likeCount = post.reaction.count || 0;
                            }
                            // Fallback properties
                            likeCount = likeCount || post.likes || post.viewCount || 0; // Wait, viewCount is view.

                            return (
                                <div
                                    key={postId}
                                    onClick={() => navigate(linkPath)}
                                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-3">
                                                 {communityCode === 1 && post.tags && post.tags.length > 0 && (
                                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">
                                                        #{post.tags[0]}
                                                    </span>
                                                )}
                                                <span className="text-xs text-slate-500">{new Date(date).toLocaleDateString()}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors truncate pr-4">
                                                {post.title}
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                                <span 
                                                    className="flex items-center gap-2 text-slate-500 cursor-pointer hover:text-indigo-600 transition-colors relative z-10"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Check for accountId in potential locations
                                                        const authId = post.author?.accountId;
                                                        if (authId) navigate(`/users/${authId}`);
                                                    }}
                                                >
                                                    {authorImg && authorImg !== 'default_img.png' ? (
                                                        <img src={authorImg} alt={authorName} className="w-5 h-5 rounded-full object-cover" />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-500">
                                                            <Users className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                    {authorName}
                                                </span>
                                                <div className="flex items-center gap-3 ml-auto md:ml-0">
                                                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {post.view || 0}</span>
                                                    <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {likeCount}</span>
                                                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {commentCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommunityListPage;
