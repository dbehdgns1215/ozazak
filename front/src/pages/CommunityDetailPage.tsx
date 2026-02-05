import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, User, Calendar, ThumbsUp, MessageSquare, Share2, 
    MoreHorizontal, AlertTriangle, Send, Bookmark, Trash2, Edit
} from 'lucide-react';
import { 
    getCommunityPostDetail, getComments, createComment, 
    addCommunityReaction, removeCommunityReaction, 
    addTILReaction, removeTILReaction,
    deleteTIL as deleteCommunityPost, // Alias deleteTIL since it hits /community endpoints
    updateComment, deleteComment 
} from '../api/community';
import MarkdownPreview from '../components/editor/MarkdownPreview';
import Toast from '../components/ui/Toast';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useAuth } from '../context/AuthContext';

// Post Item Type Definition
interface Author {
    accountId: number;
    name: string;
    img: string | null;
    companyName: string | null;
}

interface CommunityPostItem {
    communityId: number;
    communityCode: number;
    title: string;
    content: string;
    author: Author;
    tags: string[];
    view: number;
    commentCount: number;
    reaction: any[]; // API might return array or object depending on endpoint, TIL used array
    userReactions?: any[]; // For my reactions
    createdAt: string;
}

// Comment Type
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

const CommunityDetailPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth() as any;
    const [post, setPost] = useState<CommunityPostItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Toast State
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'info' | 'success' | 'error' | 'warning' });

    const showToast = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
        setToast({ visible: true, message, type });
    };

    const closeToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Comments State
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState("");
    const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

    // Reaction State
    const REACTION_TYPES = [
        { code: 1, label: '좋아요', icon: '👍' },
        { code: 2, label: '응원해요', icon: '🎉' },
        { code: 3, label: '도움돼요', icon: '💡' },
        { code: 4, label: '공감해요', icon: '❤️' },
        { code: 5, label: '대단해요', icon: '👏' },
    ];

    const [myReactions, setMyReactions] = useState<number[]>([]);
    const [reactionCounts, setReactionCounts] = useState<{ [key: number]: number }>({});

    // Initial Data Fetch
    useEffect(() => {
        const fetchDetail = async () => {
            if (!postId) {
                setError('잘못된 게시글 ID입니다.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                console.log('[CommunityDetail] Fetching Post:', postId);

                // 1. Fetch Post Detail
                const response = await getCommunityPostDetail(postId);
                const postData = response?.data || response;
                
                // Map API response ID to expected communityId/tilId structure if needed
                if (postData && !postData.communityId && postData.tilId) {
                    postData.communityId = postData.tilId; // Normalize
                }

                if (!postData) throw new Error('No data received');
                setPost(postData);

                // Reaction Init
                const counts: { [key: number]: number } = {};
                const userReactionsList: number[] = [];
                
                // 1. Total Counts from 'reactions' or 'reaction'
                const reactionsData = postData.reactions || postData.reaction; 
                
                // Handle various reaction response formats (Screen logic from TIL)
                if (Array.isArray(reactionsData)) {
                    reactionsData.forEach((r: any) => {
                        const code = r.type || r.code || r.reactionCode;
                        const count = r.count || 0;
                        if (code) {
                            counts[code] = count;
                        }
                    });
                } else if (reactionsData && typeof reactionsData === 'object') {
                    // Sometimes it might be a single object { code: 1, count: 5 }
                   if (reactionsData.code) {
                       counts[reactionsData.code] = reactionsData.count || 0;
                   }
                }

                // 2. My Reactions from 'userReactions'
                // 2. My Reactions from 'userReactions' or 'userReaction'
                const myReactionsData = postData.userReactions || postData.userReaction; // Handle singular/plural
                
                if (Array.isArray(myReactionsData)) {
                    myReactionsData.forEach((r: any) => {
                        const code = r.type || r.code || r.reactionCode; // Support various field names
                        if (code) {
                            userReactionsList.push(code);
                        }
                    });
                } else if (myReactionsData && typeof myReactionsData === 'object') {
                    // Single object case (e.g. { reactionId: 1, type: 1, ... })
                    const code = myReactionsData.type || myReactionsData.code || myReactionsData.reactionCode;
                    if (code) {
                        userReactionsList.push(code);
                    }
                }

                setReactionCounts(counts);
                setMyReactions(userReactionsList);

                // 2. Fetch Comments
                try {
                    const commentsResponse = await getComments(postId);
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
                console.error('[CommunityDetail] Error:', error);
                if (error.response?.status === 404) setError('게시글을 찾을 수 없습니다.');
                else setError('게시글을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [postId]);

    // Handle Comment Submit
    const handleAddComment = async () => {
        if (!newComment.trim() || !postId) return;

        if (newComment.length > 1000) {
            showToast("댓글은 1000자를 초과할 수 없습니다.", "error");
            return;
        }

        try {
            await createComment(postId, newComment); // API Call
            setNewComment("");

            const updatedResponse = await getComments(postId);
            let commentsData: Comment[] = [];
            if (updatedResponse?.data?.items && Array.isArray(updatedResponse.data.items)) {
                commentsData = updatedResponse.data.items;
            } else if (Array.isArray(updatedResponse)) {
                commentsData = updatedResponse;
            }
            setComments(commentsData);
        } catch (error: any) {
            console.error("Failed to add comment", error);
            if (error.response?.status === 429) {
                showToast(error.response.data?.message || "도배 방지: 잠시 후 다시 시도해주세요.", "error");
            } else {
                showToast("댓글 등록에 실패했습니다.", "error");
            }
        }
    };

    // Handle Reaction Click
    const handleReaction = async (code: number) => {
        if (!postId) return;

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
            // User confirmed that due to backend design, 
            // ALL boards should use the /api/til/{id}/reaction endpoint.
            if (isSelected) {
                await removeTILReaction(postId, code);
            } else {
                await addTILReaction(postId, code);
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
    
    const handleDeleteClick = () => {
         setIsDeleteModalOpen(true);
    };

    // Actual Delete Post Action
    const handleConfirmDelete = async () => {
        try {
            await deleteCommunityPost(postId!);
            showToast("게시글이 삭제되었습니다.", "success");
            setTimeout(() => {
                navigate('/community');
            }, 1000);
        } catch (error) {
            console.error("Delete failed", error);
            showToast("게시글 삭제에 실패했습니다.", "error");
        }
    };

    // --- Comment Actions ---
    const startEditComment = (comment: Comment) => {
        setEditingCommentId(comment.commentId);
        setEditContent(comment.content);
    };

    const cancelEditComment = () => {
        setEditingCommentId(null);
        setEditContent("");
    };

    const handleUpdateComment = async (commentId: number) => {
        if (!editContent.trim()) return;

        if (editContent.length > 1000) {
            showToast("댓글은 1000자를 초과할 수 없습니다.", "error");
            return;
        }
        try {
            await updateComment(commentId, editContent);
            
            // Update Local State
            setComments(prev => prev.map(c => 
                c.commentId === commentId 
                ? { ...c, content: editContent, updatedAt: new Date().toISOString() } 
                : c
            ));
            
            setEditingCommentId(null);
            setEditContent("");
            showToast("댓글이 수정되었습니다.", "success");
        } catch (error) {
            console.error("Failed to update comment", error);
            showToast("댓글 수정에 실패했습니다.", "error");
        }
    };

    const handleDeleteCommentClick = (commentId: number) => {
        setCommentToDelete(commentId);
    };

    const handleConfirmDeleteComment = async () => {
        if (!commentToDelete) return;
        try {
            await deleteComment(commentToDelete);
            
            // Update Local State
            setComments(prev => prev.filter(c => c.commentId !== commentToDelete));
            
            setCommentToDelete(null);
            showToast("댓글이 삭제되었습니다.", "success");
        } catch (error) {
            console.error("Failed to delete comment", error);
            showToast("댓글 삭제에 실패했습니다.", "error");
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

    if (!post) return <div className="min-h-screen pt-32 text-center">Not Found</div>;

    // Check if we should show tags and specific reactions
    const showTags = post.communityCode === 1;
    const availableReactions = post.communityCode === 1 
        ? REACTION_TYPES 
        : REACTION_TYPES.filter(r => r.code === 1);

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-900 pt-24 pb-20 font-sans">
            <Toast 
                message={toast.message} 
                type={toast.type} 
                isVisible={toast.visible} 
                onClose={closeToast} 
            />
            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="게시글 삭제"
                message="정말 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다."
                confirmText="삭제하기"
                cancelText="취소"
                isDestructive={true}
            />
            <ConfirmModal 
                isOpen={!!commentToDelete}
                onClose={() => setCommentToDelete(null)}
                onConfirm={handleConfirmDeleteComment}
                title="댓글 삭제"
                message="정말 이 댓글을 삭제하시겠습니까?"
                confirmText="삭제하기"
                cancelText="취소"
                isDestructive={true}
            />
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
                        {showTags && (
                            <div className="flex gap-2 mb-4 flex-wrap">
                                {post.tags && post.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">#{tag}</span>
                                ))}
                            </div>
                        )}
                        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight">{post.title}</h1>

                        <div className="flex items-center justify-between">
                            <div 
                                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => post.author?.accountId && navigate(`/users/${post.author.accountId}`)}
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                                     {post.author.img && post.author.img !== 'default_img.png' ? (
                                        <img src={post.author.img} alt={post.author.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 text-gray-400 m-2" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{post.author.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        {post.author.companyName && <span>{post.author.companyName}<span className="mx-1">•</span></span>}
                                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                                {isAuthenticated && user?.accountId === post.author.accountId && (
                                    <div className="flex gap-2">
                                        <button onClick={() => navigate('/community/edit/' + post.communityId)} className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={handleDeleteClick} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                {!isAuthenticated || user?.accountId !== post.author.accountId ? (
                                    <button className="px-4 py-1.5 border border-blue-600 text-blue-600 text-xs font-bold rounded-full hover:bg-blue-50 transition-colors">팔로우</button>
                                ) : null}
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-8 md:p-10">
                        <div className="prose prose-lg max-w-none text-gray-700 leading-8">
                            <MarkdownPreview markdown={post.content} />
                        </div>
                    </div>

                    {/* Reaction Bar */}
                    <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex flex-col items-center justify-center gap-4">
                        <p className="text-sm text-gray-500 font-medium">이 글에 대한 반응을 남겨주세요!</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {availableReactions.map((reaction) => (
                                <button
                                    key={reaction.code}
                                    onClick={() => handleReaction(reaction.code)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm transition-all transform hover:scale-105 active:scale-95 ${myReactions.includes(reaction.code)
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
                            <div className="absolute right-3 bottom-14 text-xs text-gray-400">
                                <span className={newComment.length > 1000 ? 'text-red-500 font-bold' : ''}>{newComment.length}</span>
                                / <span className="text-gray-500">1000</span>
                            </div>
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
                                                {comment.updatedAt && (new Date(comment.updatedAt).getTime() - new Date(comment.createdAt).getTime() > 2000) && (
                                                    <span className="text-xs text-gray-400 ml-1">(수정됨)</span>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        
                                        {editingCommentId === comment.commentId ? (
                                            <div className="mt-2">
                                                <textarea 
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none"
                                                    rows={3}
                                                />
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <button onClick={cancelEditComment} className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">취소</button>
                                                    <button onClick={() => handleUpdateComment(comment.commentId)} className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">저장</button>
                                                </div>
                                                <div className="text-right mt-1 text-xs text-gray-400">
                                                    <span className={editContent.length > 1000 ? 'text-red-500 font-bold' : ''}>{editContent.length}</span>
                                                    / 1000
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-3 mt-1.5 ml-2">
                                        {(comment.isMine || (user && user.accountId === comment.author?.accountId)) && editingCommentId !== comment.commentId && (
                                            <>
                                                <button onClick={() => startEditComment(comment)} className="text-xs text-gray-400 hover:text-blue-500 font-medium transition-colors">수정</button>
                                                <button onClick={() => handleDeleteCommentClick(comment.commentId)} className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors">삭제</button>
                                            </>
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

export default CommunityDetailPage;
