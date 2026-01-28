import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageSquare, MoreHorizontal, Share2, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { communityApi, mockComments, PostItem } from '../api/mock/community';

const CommunityDetailPage = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Mock fetch
                const allPosts = await communityApi.getPosts();
                let found = allPosts.find(p => String(p.id) === postId);

                // Fallback for direct link or if not in list
                if (!found) {
                    found = {
                        id: postId || 'mock_fallback',
                        category: 'free',
                        title: 'Mock Community Post',
                        content: 'This is a mock post content used when the post ID is not found in the initial list.',
                        author: { nickname: 'MockUser', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mock' },
                        createdAt: '2025-01-27',
                        views: 100,
                        likes: 10,
                        isLiked: false,
                        commentsCount: 5
                    };
                }

                setPost(found);
                setIsLiked(found.isLiked || false);
                setLikesCount(found.likes || 0);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleDelete = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            alert("삭제되었습니다 (Mock)");
            navigate(-1);
        }
    };

    if (loading) return <div className="min-h-screen pt-32 text-center text-white">Loading...</div>;
    if (!post) return <div className="min-h-screen pt-32 text-center text-white">Post Not Found</div>;

    const authorName = typeof post.author === 'object' ? post.author.nickname : post.author;
    const authorImg = typeof post.author === 'object' ? post.author.profileImage : null;

    return (
        <div className="min-h-screen text-white pt-24 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> 게시판으로 돌아가기
                </button>

                <div className="glass-dark rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            {authorImg ? (
                                <img src={authorImg} alt={authorName} className="w-10 h-10 rounded-full bg-slate-700" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-400">
                                    {authorName[0]}
                                </div>
                            )}
                            <div>
                                <p className="font-bold text-slate-200">{authorName}</p>
                                <p className="text-xs text-slate-500">{new Date(post.date || post.createdAt || Date.now()).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => alert('Edit Mock')} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-blue-400 transition-colors">
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={handleDelete} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <h1 className="text-2xl md:text-3xl font-bold mb-6">{post.title}</h1>
                    <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed min-h-[200px] mb-8">
                        {post.content}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex gap-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isLiked ? 'bg-pink-500/10 border-pink-500/30 text-pink-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                <span className="font-bold">{likesCount}</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors">
                                <MessageSquare className="w-5 h-5" />
                                <span className="font-bold">{post.comments || 0}</span>
                            </button>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-white transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Comments Mock */}
                <div className="mt-8 glass-dark rounded-3xl p-8 border border-white/5">
                    <h3 className="font-bold mb-6">댓글</h3>
                    <div className="flex gap-4 mb-8">
                        <div className="w-10 h-10 rounded-full bg-slate-700 shrink-0" />
                        <input
                            type="text"
                            placeholder="댓글을 남겨주세요..."
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 text-white focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div className="text-center text-slate-500 py-4">
                        댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityDetailPage;
