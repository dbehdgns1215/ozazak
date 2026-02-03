import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTilDetail, getComments, createComment, updateComment, deleteComment, addTilReaction, removeTilReaction } from '../api/community';
import MarkdownPreview from '../components/editor/MarkdownPreview';
import { ArrowLeft, Eye, MessageCircle, Calendar, User, Building2, Clock, Hash, Heart, Send, Edit2, Trash2, X, Check } from 'lucide-react';

const TILDetailPage = () => {
    const { tilId } = useParams();
    const navigate = useNavigate();
    
    const [til, setTil] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Comment form state
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Comment editing state
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');
    
    // Reaction state
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        const fetchTilDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getTilDetail(tilId);
                setTil(response.data);
            } catch (err: any) {
                console.error('Failed to fetch TIL detail:', err);
                if (err.response?.status === 404) {
                    setError('게시글을 찾을 수 없습니다.');
                } else {
                    setError('게시글을 불러오는데 실패했습니다.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (tilId) {
            fetchTilDetail();
        }
    }, [tilId]);

    useEffect(() => {
        const fetchComments = async () => {
            if (!tilId) return;
            
            try {
                setCommentsLoading(true);
                const response = await getComments(tilId);
                setComments(response.data?.items || []);
            } catch (err: any) {
                console.error('Failed to fetch comments:', err);
            } finally {
                setCommentsLoading(false);
            }
        };

        if (tilId && til) {
            fetchComments();
        }
    }, [tilId, til]);

    // Initialize reaction state when TIL is loaded
    useEffect(() => {
        if (til) {
            const reactionData = til.reaction || [];
            // Count total reactions (assuming type 0 is "like")
            const likeReaction = reactionData.find((r: any) => r.type === 0);
            setLikeCount(likeReaction?.count || 0);
            // Check if user has reacted
            setIsLiked(til.reacted || false);
        }
    }, [til]);

    // Handle reaction toggle with optimistic update
    const handleReaction = async () => {
        if (!tilId) return;
        
        const previousLiked = isLiked;
        const previousCount = likeCount;
        
        try {
            // Optimistic update
            setIsLiked(!isLiked);
            setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
            
            // API call
            if (isLiked) {
                await removeTilReaction(tilId);
            } else {
                await addTilReaction(tilId, 0); // type 0 for "like"
            }
            
            // Optionally refetch TIL to get updated reaction count
            // const response = await getTilDetail(tilId);
            // setTil(response.data);
        } catch (err: any) {
            console.error('Failed to toggle reaction:', err);
            
            // Show user-friendly error message
            if (err.response?.status === 403) {
                alert('좋아요 기능이 현재 준비 중입니다. 잠시 후 다시 시도해주세요.');
            } else if (err.response?.status === 401) {
                alert('로그인이 필요합니다.');
            } else {
                alert('좋아요 처리에 실패했습니다. 다시 시도해주세요.');
            }
            
            // Revert on error
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
        }
    };

    // Handle comment submit with optimistic update
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !tilId) return;
        
        try {
            setIsSubmitting(true);
            
            // Optimistic update - add temporary comment
            const tempComment = {
                commentId: Date.now(),
                author: {
                    accountId: 0,
                    name: '나',
                    img: null,
                    companyName: null
                },
                content: commentText,
                createdAt: new Date().toISOString(),
                updatedAt: null,
                isMine: true
            };
            setComments(prev => [...prev, tempComment]);
            setCommentText('');
            
            // API call
            await createComment(tilId, commentText);
            
            // Refetch comments to get the real comment with correct ID
            const response = await getComments(tilId);
            setComments(response.data?.items || []);
        } catch (err) {
            console.error('Failed to submit comment:', err);
            // Remove optimistic comment on error
            setComments(prev => prev.filter(c => c.commentId !== Date.now()));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Start editing a comment
    const handleEditComment = (commentId: number, currentContent: string) => {
        setEditingCommentId(commentId);
        setEditingText(currentContent);
    };

    // Cancel editing
    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingText('');
    };

    // Save edited comment
    const handleSaveEdit = async (commentId: number) => {
        if (!editingText.trim()) return;
        
        try {
            // Optimistic update
            setComments(prev => prev.map(c => 
                c.commentId === commentId 
                    ? { ...c, content: editingText, updatedAt: new Date().toISOString() }
                    : c
            ));
            setEditingCommentId(null);
            setEditingText('');
            
            // API call
            await updateComment(commentId, editingText);
            
            // Refetch to ensure consistency
            if (tilId) {
                const response = await getComments(tilId);
                setComments(response.data?.items || []);
            }
        } catch (err) {
            console.error('Failed to update comment:', err);
            // Refetch on error
            if (tilId) {
                const response = await getComments(tilId);
                setComments(response.data?.items || []);
            }
        }
    };

    // Delete a comment
    const handleDeleteComment = async (commentId: number) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
        
        try {
            // Optimistic update
            setComments(prev => prev.filter(c => c.commentId !== commentId));
            
            // API call
            await deleteComment(commentId);
        } catch (err) {
            console.error('Failed to delete comment:', err);
            // Refetch on error
            if (tilId) {
                const response = await getComments(tilId);
                setComments(response.data?.items || []);
            }
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    };

    const getTimeAgo = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return '방금 전';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
        return formatDate(dateString);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-cyan-500/20 border-t-cyan-500 mb-4"></div>
                    <p className="text-slate-400 text-lg font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !til) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Oops!</h2>
                    <p className="text-slate-400 mb-6">{error || '게시글을 찾을 수 없습니다.'}</p>
                    <button 
                        onClick={() => navigate('/til')}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/50"
                    >
                        목록으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
            </div>

            {/* Header */}
            <header className="relative bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <button 
                        onClick={() => navigate('/til')}
                        className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors font-medium group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to List</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative max-w-6xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="mb-12">
                    {/* Tags */}
                    {til.tags && til.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {til.tags.map((tag: string, index: number) => (
                                <span 
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 rounded-full text-sm font-semibold border border-cyan-500/20 hover:border-cyan-500/40 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                                >
                                    <Hash size={14} />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent leading-tight">
                        {til.title}
                    </h1>

                    {/* Author & Stats */}
                    <div className="flex flex-wrap items-center gap-8">
                        {/* Author */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img 
                                    src={til.author?.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${til.author?.name || 'user'}`}
                                    alt={til.author?.name}
                                    className="w-16 h-16 rounded-full object-cover ring-4 ring-cyan-500/20"
                                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${til.author?.name || 'user'}`;
                                    }}
                                />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-950"></div>
                            </div>
                            <div>
                                <div className="font-bold text-white text-xl">{til.author?.name}</div>
                                {til.author?.companyName && (
                                    <div className="text-sm text-slate-400 flex items-center gap-1">
                                        <Building2 size={14} />
                                        {til.author.companyName}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-slate-400 ml-auto">
                            <div className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                                <Calendar size={18} />
                                <span className="text-sm font-medium">{formatDate(til.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2 hover:text-green-400 transition-colors">
                                <Eye size={18} />
                                <span className="text-sm font-medium">{til.view || 0}</span>
                            </div>
                            <div className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                                <MessageCircle size={18} />
                                <span className="text-sm font-medium">{comments.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mb-8">
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800/50 shadow-2xl">
                        <div className="prose prose-invert prose-lg max-w-none
                            prose-headings:text-white prose-headings:font-bold
                            prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                            prose-p:text-white prose-p:leading-relaxed
                            prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:underline
                            prose-code:text-cyan-300 prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono
                            prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-pre:text-slate-50
                            prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:bg-cyan-500/5 prose-blockquote:text-slate-50
                            prose-strong:text-white prose-strong:font-bold
                            prose-ul:text-white prose-ol:text-white
                            prose-li:text-white prose-li:marker:text-cyan-400">
                            <MarkdownPreview markdown={til.content || ''} />
                        </div>
                    </div>
                </div>

                {/* Reaction Button */}
                <div className="mb-12 flex justify-center">
                    <button
                        onClick={handleReaction}
                        className={`group relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 ${
                            isLiked
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/50 scale-105'
                                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700 hover:border-pink-500/50'
                        }`}
                    >
                        <Heart 
                            size={24} 
                            className={`transition-all duration-300 ${
                                isLiked ? 'fill-white scale-110' : 'group-hover:scale-110'
                            }`}
                        />
                        <span>{likeCount} {isLiked ? 'Liked' : 'Like'}</span>
                        {isLiked && (
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 blur-xl opacity-50 -z-10"></div>
                        )}
                    </button>
                </div>

                {/* Comments Section */}
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-800/50">
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <MessageCircle className="text-cyan-400" size={32} />
                        <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                            Comments {comments.length > 0 && <span className="text-cyan-400">({comments.length})</span>}
                        </span>
                    </h2>

                    {/* Comment Input Form */}
                    <form onSubmit={handleCommentSubmit} className="mb-8">
                        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 focus-within:border-cyan-500/50 transition-colors">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="댓글을 작성하세요..."
                                className="w-full bg-transparent text-slate-200 placeholder-slate-500 p-4 rounded-t-xl resize-none focus:outline-none min-h-[120px]"
                                disabled={isSubmitting}
                            />
                            <div className="flex items-center justify-between p-4 border-t border-slate-700/50">
                                <span className="text-sm text-slate-500">
                                    {commentText.length} / 1000
                                </span>
                                <button
                                    type="submit"
                                    disabled={!commentText.trim() || isSubmitting}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>작성 중...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>댓글 작성</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>

                    {commentsLoading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-slate-700 border-t-cyan-400"></div>
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-16 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                            <div className="text-6xl mb-4">💬</div>
                            <p className="text-slate-400 text-lg">첫 번째 댓글을 작성해보세요!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment: any) => (
                                <div 
                                    key={comment.commentId}
                                    className={`p-6 rounded-xl border transition-all hover:scale-[1.01] ${
                                        comment.isMine 
                                            ? 'bg-cyan-500/5 border-cyan-500/30 hover:border-cyan-500/50' 
                                            : 'bg-slate-800/30 border-slate-700/50 hover:border-slate-600'
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <img 
                                            src={comment.author?.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.name || 'user'}`}
                                            alt={comment.author?.name}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-700"
                                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.name || 'user'}`;
                                            }}
                                        />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <span className="font-bold text-white">{comment.author?.name}</span>
                                                {comment.author?.companyName && (
                                                    <span className="text-sm text-slate-400 flex items-center gap-1">
                                                        <Building2 size={12} />
                                                        {comment.author.companyName}
                                                    </span>
                                                )}
                                                {comment.isMine && (
                                                    <span className="px-2 py-0.5 bg-cyan-500 text-white text-xs font-semibold rounded-full">
                                                        ME
                                                    </span>
                                                )}
                                                <span className="text-sm text-slate-500 flex items-center gap-1 ml-auto">
                                                    <Clock size={14} />
                                                    {getTimeAgo(comment.createdAt)}
                                                </span>
                                            </div>
                                            
                                            {/* Editing mode */}
                                            {editingCommentId === comment.commentId ? (
                                                <div className="mt-3">
                                                    <textarea
                                                        value={editingText}
                                                        onChange={(e) => setEditingText(e.target.value)}
                                                        className="w-full bg-slate-800 text-slate-200 placeholder-slate-500 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[100px] border border-slate-700"
                                                    />
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <button
                                                            onClick={() => handleSaveEdit(comment.commentId)}
                                                            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all"
                                                        >
                                                            <Check size={16} />
                                                            <span>저장</span>
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-slate-600 transition-all"
                                                        >
                                                            <X size={16} />
                                                            <span>취소</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                                                        {comment.content}
                                                    </p>
                                                    {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                                                        <p className="text-xs text-slate-500 mt-2 italic">수정됨</p>
                                                    )}
                                                    
                                                    {/* Edit/Delete buttons for own comments */}
                                                    {comment.isMine && (
                                                        <div className="flex items-center gap-2 mt-3">
                                                            <button
                                                                onClick={() => handleEditComment(comment.commentId, comment.content)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-700 transition-all"
                                                            >
                                                                <Edit2 size={14} />
                                                                <span>수정</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteComment(comment.commentId)}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/20 transition-all"
                                                            >
                                                                <Trash2 size={14} />
                                                                <span>삭제</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default TILDetailPage;
