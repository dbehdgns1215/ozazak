import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, ThumbsUp, MessageSquare, Share2, MoreHorizontal, AlertTriangle, Smile } from 'lucide-react';
import { communityApi, TILItem, mockComments } from '../api/mock/community';

const TILDetailPage = () => {
    const { tilId } = useParams();
    const navigate = useNavigate();
    const [til, setTil] = useState<TILItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState(mockComments);
    const [newComment, setNewComment] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const allTils = await communityApi.getTILs();
                const found = allTils.find(t => t.id === tilId || String(t.id).split('_')[0] === tilId); // Handle mock IDs from feed

                // If not found in the small mock list, we use a fallback mock
                setTil(found || {
                    id: tilId || 'mock_999',
                    title: 'React Server Components Deep Dive',
                    content: 'This is a detailed view of the TIL...',
                    author: { nickname: 'MockUser', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mock' },
                    date: '2025-01-01',
                    tags: ['React', 'RSC'],
                    reactions: 100,
                    commentsCount: 2,
                    isLiked: false
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [tilId]);

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const comment = {
            id: `new_${Date.now()}`,
            author: "Me",
            content: newComment,
            date: new Date().toISOString()
        };
        setComments([...comments, comment]);
        setNewComment("");
    };

    if (loading) return <div className="min-h-screen pt-32 text-center text-white">Loading...</div>;
    if (!til) return <div className="min-h-screen pt-32 text-center text-white">NOT FOUND</div>;

    return (
        <div className="min-h-screen text-white pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">

                {/* Navigation */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> 목록으로 돌아가기
                </button>

                {/* Article Header */}
                <div className="mb-10">
                    <div className="flex flex-wrap gap-2 mb-6">
                        {til.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-300 text-sm font-bold rounded-full border border-blue-500/20">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{til.title}</h1>

                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-[2px]">
                                <img src={til.author.profileImage} alt={til.author.nickname} className="w-full h-full rounded-full bg-slate-900" />
                            </div>
                            <div>
                                <p className="font-semibold text-white text-lg">{til.author.nickname}</p>
                                <p className="text-sm text-slate-500 flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> {new Date(til.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 relative">
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-red-400" title="Report">
                                <AlertTriangle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="prose prose-invert max-w-none mb-16">
                    <div className="glass-dark p-8 rounded-3xl min-h-[300px] border border-white/5">
                        <p className="text-lg text-slate-300 leading-relaxed whitespace-pre-line">
                            {til.content}
                            {`\n\n
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            `}
                        </p>
                    </div>
                </div>

                {/* Reaction Area */}
                <div className="flex flex-col items-center gap-8 mb-16 relative">
                    <div className="flex gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full transition-all hover:scale-105 active:scale-95 group"
                            >
                                <ThumbsUp className={`w-6 h-6 ${til.isLiked ? 'text-blue-400 fill-current' : 'text-slate-400'} group-hover:text-blue-400 transition-colors`} />
                                <span className="font-bold text-lg">{til.reactions}</span>
                            </button>
                            {/* Emoji Picker Mock */}
                            {showEmojiPicker && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-800 p-2 rounded-xl border border-white/10 shadow-xl flex gap-2 animate-in fade-in zoom-in duration-200 z-50">
                                    {['👍', '❤️', '🔥', '🎉', '💡'].map(emoji => (
                                        <button key={emoji} className="p-2 hover:bg-white/10 rounded-lg text-xl" onClick={() => setShowEmojiPicker(false)}>{emoji}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button className="flex items-center gap-3 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full transition-all hover:scale-105 active:scale-95">
                            <MessageSquare className="w-6 h-6 text-slate-400" />
                            <span className="font-bold text-lg">댓글 {comments.length}</span>
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="max-w-3xl mx-auto">
                    <h3 className="text-xl font-bold mb-6">Comments</h3>

                    {/* Comment Input */}
                    <div className="flex gap-4 mb-10">
                        <div className="w-10 h-10 rounded-full bg-slate-700 shrink-0" />
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="어떤 생각이 드시나요?"
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-800 transition-all min-h-[100px] resize-none"
                            />
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={handleAddComment}
                                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50"
                                    disabled={!newComment.trim()}
                                >
                                    등록
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comment List */}
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4 group">
                                <div className="w-10 h-10 rounded-full bg-slate-700 shrink-0 flex items-center justify-center font-bold text-slate-400">
                                    {comment.author[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-slate-200">{comment.author}</span>
                                        <span className="text-xs text-slate-500">{new Date(comment.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed">{comment.content}</p>
                                    <div className="flex gap-4 mt-2">
                                        <button className="text-xs text-slate-500 hover:text-white">좋아요</button>
                                        <button className="text-xs text-slate-500 hover:text-white">답글 달기</button>
                                        <button className="text-xs text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">신고</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TILDetailPage;
