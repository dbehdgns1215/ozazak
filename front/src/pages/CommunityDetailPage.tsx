import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageSquare, Eye, Calendar, User, Building2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCommunityPostDetail, getComments, createComment, updateComment, deleteComment, addCommunityReaction, removeCommunityReaction } from '../api/community';
import MarkdownPreview from '../components/editor/MarkdownPreview';

interface Author {
    accountId: number;
    name: string;
    img: string | null;
    companyName: string | null;
}

interface NavigationPost {
    communityId: string;
    title: string;
    createdAt: string;
}

interface CommunityPost {
    communityId: number;
    communityCode: number;
    author: Author;
    title: string;
    content: string;
    view: number;
    createdAt: string;
    reaction: {
        code: number;
        count: number;
    };
    navigation?: {
        prev: NavigationPost | null;
        next: NavigationPost | null;
    };
}

interface Comment {
    commentId: number;
    author: Author;
    content: string;
    createdAt: string;
    updatedAt: string | null;
    isMine: boolean;
}

const CommunityDetailPage = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    
    // Post state
    const [post, setPost] = useState<CommunityPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Comments state
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Comment editing state
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState('');
    
    // Reaction state
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    // Fetch post detail
    useEffect(() => {
        const fetchPost = async () => {
            if (!postId) return;
            
            try {
                setLoading(true);
                setError(null);
                const response = await getCommunityPostDetail(postId);
                console.log('Community post response:', response);
                setPost(response.data);
                
                // Set reaction state
                if (response.data?.reaction) {
                    setIsLiked(response.data.reaction.code === 1);
                    setLikeCount(response.data.reaction.count || 0);
                }
            } catch (err) {
                console.error('Failed to fetch community post:', err);
                setError('게시글을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            if (!postId || !post) return;
            
            try {
                setCommentsLoading(true);
                const response = await getComments(postId);
                console.log('Comments response:', response);
                setComments(response.data?.items || []);
            } catch (err) {
                console.error('Failed to fetch comments:', err);
            } finally {
                setCommentsLoading(false);
            }
        };

        if (postId && post) {
            fetchComments();
        }
    }, [postId, post]);

    // Handle reaction toggle
    const handleLike = async () => {
        if (!postId) return;
        
        const previousLiked = isLiked;
        const previousCount = likeCount;
        
        try {
            // Optimistic update
            setIsLiked(!isLiked);
            setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
            
            // API call
            if (isLiked) {
                await removeCommunityReaction(postId);
            } else {
                await addCommunityReaction(postId, 1); // code: 1 for like
            }
        } catch (err: any) {
            console.error('Failed to toggle reaction:', err);
            
            // Show user-friendly error message
            if (err?.response?.status === 403) {
                alert('좋아요 기능이 현재 준비 중입니다.');
            } else {
                alert('좋아요 처리에 실패했습니다.');
            }
            
            // Revert on error
            setIsLiked(previousLiked);
            setLikeCount(previousCount);
        }
    };

    // Handle comment submission
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !postId) return;
        
        try {
            setIsSubmitting(true);
            
            // Optimistic update
            const tempComment = {
                commentId: Date.now(),
                author: {
                    accountId: 1,
                    name: 'Me',
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
            await createComment(postId, commentText);
            
            // Refetch comments
            const response = await getComments(postId);
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
            
            // Refetch
            if (postId) {
                const response = await getComments(postId);
                setComments(response.data?.items || []);
            }
        } catch (err) {
            console.error('Failed to update comment:', err);
            // Refetch on error
            if (postId) {
                const response = await getComments(postId);
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
            if (postId) {
                const response = await getComments(postId);
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
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
            <div className="min-h-screen pt-32 text-center text-white">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                <p className="text-slate-400">로딩 중...</p>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen pt-32 text-center text-white px-6">
                <div className="text-6xl mb-4">😕</div>
                <h2 className="text-2xl font-bold mb-2">앗, 문제가 생겼어요!</h2>
                <p className="text-slate-400 mb-6">{error || '게시글을 찾을 수 없습니다.'}</p>
                <button 
                    onClick={() => navigate('/community')}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                    목록으로 돌아가기
                </button>
            </div>
        );
    }

    const authorName = post.author?.name || 'Unknown';
    const authorImg = post.author?.img;

    return (
        <div className="min-h-screen text-white pt-24 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Back button */}
                <button
                    onClick={() => navigate('/community')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> 게시판으로 돌아가기
                </button>

                {/* Main content card */}
                <div className="glass-dark rounded-3xl p-8 border border-white/5 relative overflow-hidden mb-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {authorImg ? (
                                <img 
                                    src={authorImg} 
                                    alt={authorName} 
                                    className="w-12 h-12 rounded-full bg-slate-700 object-cover"
                                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`;
                                    }}
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                                    <User size={24} className="text-white" />
                                </div>
                            )}
                            <div>
                                <p className="font-bold text-white">{authorName}</p>
                                {post.author?.companyName && (
                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                        <Building2 size={12} />
                                        {post.author.companyName}
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                                <Eye size={16} />
                                <span>{post.view || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar size={16} />
                                <span>{formatDate(post.createdAt).split(',')[0]}</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white">{post.title}</h1>
                    
                    {/* Content */}
                    <div className="prose prose-invert max-w-none text-white leading-relaxed min-h-[200px] mb-8">
                        <MarkdownPreview markdown={post.content || ''} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                                isLiked 
                                    ? 'bg-pink-500/10 border-pink-500/30 text-pink-400' 
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="font-bold">{likeCount}</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400">
                            <MessageSquare className="w-5 h-5" />
                            <span className="font-bold">{comments.length}</span>
                        </button>
                    </div>
                </div>

                {/* Navigation (prev/next) */}
                {post.navigation && (post.navigation.prev || post.navigation.next) && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {post.navigation.prev ? (
                            <button
                                onClick={() => navigate(`/community/post/${post.navigation?.prev?.communityId}`)}
                                className="glass-dark rounded-xl p-4 border border-white/5 hover:border-indigo-500/30 transition-colors text-left"
                            >
                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                    <ChevronLeft size={16} />
                                    <span>이전 글</span>
                                </div>
                                <p className="text-white font-medium truncate">{post.navigation?.prev?.title}</p>
                            </button>
                        ) : (
                            <div className="glass-dark rounded-xl p-4 border border-white/5 opacity-50"></div>
                        )}
                        
                        {post.navigation.next ? (
                            <button
                                onClick={() => navigate(`/community/post/${post.navigation?.next?.communityId}`)}
                                className="glass-dark rounded-xl p-4 border border-white/5 hover:border-indigo-500/30 transition-colors text-right"
                            >
                                <div className="flex items-center justify-end gap-2 text-slate-400 text-sm mb-2">
                                    <span>다음 글</span>
                                    <ChevronRight size={16} />
                                </div>
                                <p className="text-white font-medium truncate">{post.navigation?.next?.title}</p>
                            </button>
                        ) : (
                            <div className="glass-dark rounded-xl p-4 border border-white/5 opacity-50"></div>
                        )}
                    </div>
                )}

                {/* Comments Section */}
                <div className="glass-dark rounded-3xl p-8 border border-white/5">
                    <h3 className="font-bold text-xl mb-6 text-white">댓글 {comments.length > 0 && `(${comments.length})`}</h3>
                    
                    {/* Comment input */}
                    <form onSubmit={handleCommentSubmit} className="mb-8">
                        <div className="flex gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-700 shrink-0 flex items-center justify-center">
                                <User size={20} className="text-slate-400" />
                            </div>
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="댓글을 남겨주세요..."
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 resize-none min-h-[80px]"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={!commentText.trim() || isSubmitting}
                                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all"
                            >
                                {isSubmitting ? '등록 중...' : '댓글 등록'}
                            </button>
                        </div>
                    </form>

                    {/* Comments list */}
                    {commentsLoading ? (
                        <div className="text-center text-slate-500 py-4">로딩 중...</div>
                    ) : comments.length === 0 ? (
                        <div className="text-center text-slate-500 py-8">
                            댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div 
                                    key={comment.commentId}
                                    className={`p-4 rounded-xl transition-all ${
                                        comment.isMine 
                                            ? 'bg-indigo-500/5 border border-indigo-500/20' 
                                            : 'bg-slate-800/30'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <img 
                                            src={comment.author?.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.name}`}
                                            alt={comment.author?.name}
                                            className="w-10 h-10 rounded-full bg-slate-700"
                                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author?.name}`;
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-bold text-white">{comment.author?.name}</span>
                                                {comment.author?.companyName && (
                                                    <span className="text-xs text-slate-400">{comment.author.companyName}</span>
                                                )}
                                                {comment.isMine && (
                                                    <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs font-semibold rounded-full">ME</span>
                                                )}
                                                <span className="text-sm text-slate-500 ml-auto">
                                                    <Clock size={12} className="inline mr-1" />
                                                    {getTimeAgo(comment.createdAt)}
                                                </span>
                                            </div>
                                            
                                            {/* Editing mode */}
                                            {editingCommentId === comment.commentId ? (
                                                <div className="mt-2">
                                                    <textarea
                                                        value={editingText}
                                                        onChange={(e) => setEditingText(e.target.value)}
                                                        className="w-full bg-slate-800 text-white p-3 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500 resize-none min-h-[80px]"
                                                    />
                                                    <div className="flex gap-2 mt-2">
                                                        <button
                                                            onClick={() => handleSaveEdit(comment.commentId)}
                                                            className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                                        >
                                                            저장
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="px-4 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                                                        >
                                                            취소
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                                                        {comment.content}
                                                    </p>
                                                    {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                                                        <p className="text-xs text-slate-500 mt-1 italic">수정됨</p>
                                                    )}
                                                    
                                                    {comment.isMine && (
                                                        <div className="flex gap-2 mt-2">
                                                            <button
                                                                onClick={() => handleEditComment(comment.commentId, comment.content)}
                                                                className="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                                                            >
                                                                수정
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteComment(comment.commentId)}
                                                                className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                                                            >
                                                                삭제
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
            </div>
        </div>
    );
};

export default CommunityDetailPage;
