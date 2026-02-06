
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    BookOpen, MessageSquare, Flame, Briefcase, 
    FileText, Users, HelpCircle, ChevronRight, Loader2
} from 'lucide-react';
import { getCommunityCategories } from '../api/community';

const CommunityMainPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await getCommunityCategories();
                // Expecting response structure { data: { items: [...] } } or similar
                // Based on user request: { data: { items: [...] } }
                // Filter out TIL (1) and HOT (3) as per user request
                const items = (response?.data?.items || response?.items || [])
                    .filter(cat => cat.communityCode !== 1 && cat.communityCode !== 3);
                setCategories(items);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("카테고리 정보를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

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

    const getGradient = (code) => {
        switch (code) {
            case 1: return "from-emerald-500/10 to-teal-500/5 hover:to-emerald-500/20";
            case 2: return "from-blue-500/10 to-indigo-500/5 hover:to-blue-500/20";
            case 3: return "from-orange-500/10 to-red-500/5 hover:to-orange-500/20";
            case 4: return "from-purple-500/10 to-violet-500/5 hover:to-purple-500/20";
            case 5: return "from-pink-500/10 to-rose-500/5 hover:to-pink-500/20";
            case 6: return "from-indigo-500/10 to-blue-500/5 hover:to-indigo-500/20";
            case 7: return "from-yellow-500/10 to-amber-500/5 hover:to-yellow-500/20";
            default: return "from-slate-500/10 to-gray-500/5 hover:to-slate-500/20";
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 pt-28 flex justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-50 pt-28 text-center px-6">
            <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-600 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                >
                    다시 시도
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pt-8 pb-20 px-6 font-sans rounded-[30px] fade-in">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-black mb-3 text-slate-900 tracking-tight">
                        커뮤니티
                    </h1>
                    <p className="text-slate-500 text-lg">
                        개발자들과 함께 성장하고 소통하는 공간입니다.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <button
                            key={cat.communityCode}
                            onClick={() => navigate(`/community/board/${cat.communityCode}`)}
                            className="group relative flex flex-col items-start bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left w-full outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(cat.communityCode)} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl`} />
                            
                            <div className="relative z-10 w-full">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all">
                                        {getIcon(cat.communityCode)}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transform group-hover:translate-x-1 transition-all" />
                                </div>
                                
                                <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-900 transition-colors">
                                    {cat.title}
                                </h2>
                                <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                                    {cat.description}
                                </p>

                                <div className="flex items-center gap-4 text-xs font-medium text-slate-400 pt-4 border-t border-slate-50 group-hover:border-slate-100/50 transition-colors w-full">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-colors" />
                                        전체 {cat.totalPostCount || 0}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 group-hover:bg-emerald-400 transition-colors" />
                                        오늘 {cat.todayPostCount || 0}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommunityMainPage;
