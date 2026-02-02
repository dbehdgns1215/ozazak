import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, User, Calendar, ThumbsUp, MessageSquare, Share2, 
    MoreHorizontal, AlertTriangle, Send, Bookmark, Trash2, Edit
} from 'lucide-react';
import { getTilDetail, getComments, createComment, addTilReaction, removeTilReaction } from '../api/community';
import MarkdownPreview from '../components/editor/MarkdownPreview';
import { useAuth } from '../context/AuthContext';

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

// Comment 타입 정의 (API 응답 기준)
interface Comment {
    commentId: number;
    content: string;
    author: {
        accountId: number;
        img: string | null;
        name: string;
        companyName: string | null;
    };
    createdAt: string;
    updatedAt: string | null;
    isMine: boolean;
}

const TILDetailPage = () => {
    const { tilId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth() as any; // Get Auth (Type assertion for JS context)
    const [til, setTil] = useState<TILItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Comments State
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    
    // Reaction State
    // reaction: [{ type: number, count: number, isMine: boolean }] 형태가 이상적이나, 
    // 현재 API 타입 정의(any[])와 기존 로직(length)을 고려하여 적절히 구현.
    // 사용자가 요구한 5가지 리액션 코드 매핑
    const REACTION_TYPES = [
        { code: 1, label: '좋아요', icon: '👍' },
        { code: 2, label: '응원해요', icon: '🎉' },
        { code: 3, label: '도움돼요', icon: '💡' },
        { code: 4, label: '공감해요', icon: '❤️' },
        { code: 5, label: '대단해요', icon: '👏' },
    ];

    const [myReactions, setMyReactions] = useState<number[]>([]); // 내가 선택한 리액션 코드들 (Array)
    // 리액션 카운트 맵 (code -> count)
    const [reactionCounts, setReactionCounts] = useState<{[key: number]: number}>({});

    // Initial Data Fetch
    useEffect(() => {
        const fetchDetail = async () => {
            if (!tilId) {
                setError('잘못된 TIL ID입니다.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                console.log('[TILDetail] Fetching TIL:', tilId);
                
                // 1. Fetch TIL Detail
                const tilResponse = await getTilDetail(tilId);
                const tilData = tilResponse?.data || tilResponse;
                
                if (!tilData) throw new Error('No data received');
                setTil(tilData);
                
                // Reaction Init
                const counts: {[key: number]: number} = {};
                const userReactions: number[] = [];
                
                const reactionsData = tilData.reactions || tilData.reaction; // Handle both plural (API) and singular (Legacy/Type)
                if (Array.isArray(reactionsData)) {
                    reactionsData.forEach((r: any) => {
                        const code = r.type || r.code || r.reactionCode;
                        if (code) {
                            counts[code] = (counts[code] || 0) + (r.count || 1);
                        }
                        // Check if it's my reaction
                        if (r.isMine || r.accountId === user?.accountId) { 
                             userReactions.push(code);
                        }
                    });
                }
                
                setReactionCounts(counts);
                setMyReactions(userReactions);

                // 2. Fetch Comments
                try {
                    const commentsResponse = await getComments(tilId);
                    let commentsData: Comment[] = [];
                    if (commentsResponse?.data?.items && Array.isArray(commentsResponse.data.items)) {
                        commentsData = commentsResponse.data.items;
                    } else if (Array.isArray(commentsResponse)) {
                        commentsData = commentsResponse;
                    }
                    setComments(commentsData);
                } catch (cmdErr) {
                    console.error("Failed to load comments", cmdErr);
                    setComments([]);
                }

            } catch (error: any) {
                console.error('[TILDetail] Error:', error);
                if (error.response?.status === 404) setError('게시글을 찾을 수 없습니다.');
                else setError('게시글을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchDetail();
    }, [tilId]);

    // Handle Comment Submit
    const handleAddComment = async () => {
        if (!newComment.trim() || !tilId) return;
        
        try {
            await createComment(tilId, newComment); // API Call
            setNewComment("");
            
            const updatedResponse = await getComments(tilId);
            let commentsData: Comment[] = [];
            if (updatedResponse?.data?.items && Array.isArray(updatedResponse.data.items)) {
                commentsData = updatedResponse.data.items;
            } else if (Array.isArray(updatedResponse)) {
                commentsData = updatedResponse;
            }
            setComments(commentsData);
        } catch (error) {
            console.error("Failed to add comment", error);
            alert("댓글 등록에 실패했습니다.");
        }
    };

    // Handle Reaction Click
    const handleReaction = async (code: number) => {
        if (!tilId) return;

        const prevReactions = [...myReactions];
        const isSelected = prevReactions.includes(code);
        
        // Optimistic UI Update
        if (isSelected) {
            // Remove reaction
            setMyReactions(prev => prev.filter(c => c !== code));
            setReactionCounts(prev => ({
                ...prev,
                [code]: Math.max((prev[code] || 0) - 1, 0)
            }));
        } else {
            // Add reaction
            setMyReactions(prev => [...prev, code]);
            setReactionCounts(prev => ({
                ...prev,
                [code]: (prev[code] || 0) + 1
            }));
        }

        try {
            if (isSelected) {
                // Let's modify community.js later if needed. usage here:
                await removeTilReaction(tilId, code); 
            } else {
                await addTilReaction(tilId, code);
            }
        } catch (error) {
            console.error("Reaction failed", error);
            setMyReactions(prevReactions); // Rollback
            setReactionCounts(prev => { // Rollback counts
                 const rolledBack = { ...prev };
                 if (isSelected) rolledBack[code] = (rolledBack[code] || 0) + 1;
                 else rolledBack[code] = Math.max((rolledBack[code] || 0) - 1, 0);
                 return rolledBack;
            });
            alert("리액션 처리에 실패했습니다.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#f8f9fa] pt-32 text-center text-gray-400">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            Loading...
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#f8f9fa] pt-32 text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">목록으로 돌아가기</button>
        </div>
    );

    if (!til) return <div className="min-h-screen pt-32 text-center">Not Found</div>;

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-900 pt-24 pb-20 font-sans">
            <div className="max-w-4xl mx-auto px-4 lg:px-8">

                {/* 1. Top Navigation */}
                <nav className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-4 h-4" /> 목록으로
                    </button>
                    {/* ... (Existing buttons) ... */}
                </nav>

                {/* 2. Main Article Card */}
                <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
                    {/* ... (Header) ... */}
                    
                    {/* Header: Title & Meta */}
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {til.tags && til.tags.map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">#{tag}</span>
                            ))}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">{til.title}</h1>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                                     {til.author.img && til.author.img !== 'default_img.png' ? (
                                        <img src={til.author.img} alt={til.author.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 text-gray-400 m-2" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{til.author.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                         {til.author.companyName && <span>{til.author.companyName}<span className="mx-1">•</span></span>}
                                        <span>{new Date(til.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                                {isAuthenticated && user?.accountId === til.author.accountId && (
                                    <div className="flex gap-2">
                                        <button onClick={() => navigate(`/til/edit/${til.tilId}`)} className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {!isAuthenticated || user?.accountId !== til.author.accountId ? (
                                    <button className="px-4 py-1.5 border border-blue-600 text-blue-600 text-xs font-bold rounded-full hover:bg-blue-50 transition-colors">팔로우</button>
                                ) : null}
                        </div>
                    </div>

                    {/* Content Body (Random Image Removed) */}
                    <div className="p-8 md:p-10">
                        <div className="prose prose-lg max-w-none text-gray-700 leading-8">
                            <MarkdownPreview markdown={til.content} />
                        </div>
                    </div>

                    {/* Reaction Bar */}
                    <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex flex-col items-center justify-center gap-4">
                        <p className="text-sm text-gray-500 font-medium">이 글에 대한 반응을 남겨주세요!</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {REACTION_TYPES.map((reaction) => (
                                <button 
                                    key={reaction.code}
                                    onClick={() => handleReaction(reaction.code)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all transform hover:scale-105 active:scale-95 ${
                                        myReactions.includes(reaction.code)
                                        ? 'bg-blue-50 border-blue-200 text-blue-600 ring-2 ring-blue-100' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <span className="text-lg">{reaction.icon}</span>
                                    <span className="text-sm font-bold">{reaction.label}</span>
                                    <span className={`text-xs ml-1 font-medium ${myReactions.includes(reaction.code) ? 'text-blue-500' : 'text-gray-400'}`}>
                                        {reactionCounts[reaction.code] || 0}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </article>

                {/* 3. Comment Section */}
                <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                        댓글 <span className="text-blue-600">{comments.length}</span>
                    </h3>

                    {/* Comment Input */}
                    <div className="flex gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                             <User className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1 relative">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="궁금한 점이나 응원의 메시지를 남겨보세요."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all min-h-[100px] resize-none text-sm"
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="absolute bottom-3 right-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
                            >
                                등록
                            </button>
                        </div>
                    </div>

                    {/* Comment List */}
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment.commentId} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
                                     {comment.author?.img && comment.author.img !== 'default_img.png' ? (
                                         <img src={comment.author.img} alt="" className="w-full h-full object-cover"/>
                                     ) : <User className="w-6 h-6 text-gray-400" />}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-50 rounded-xl p-4 rounded-tl-none">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900 text-sm">{comment.author?.name || '익명'}</span>
                                                {comment.author?.companyName && (
                                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{comment.author.companyName}</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                    <div className="flex gap-3 mt-1.5 ml-2">
                                        <button className="text-xs text-gray-400 hover:text-gray-600 font-medium">좋아요</button>
                                        <button className="text-xs text-gray-400 hover:text-gray-600 font-medium">답글 달기</button>
                                        {comment.isMine && (
                                            <button className="text-xs text-gray-400 hover:text-red-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">삭제</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TILDetailPage;
