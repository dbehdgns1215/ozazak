import React, { useEffect, useState } from 'react';
import {
    User, Award, FileText, Calendar, Activity, Briefcase, Settings,
    LogOut, Lock, ChevronRight, CheckCircle2, XCircle, Plus, MoreHorizontal, X,
    Trash2, Edit2, Pencil
} from 'lucide-react';
import { userApi, UserProfile, UserStreak } from '../api/mock/user';
import { useNavigate } from 'react-router-dom';
import BlockCreationModal from '../components/BlockCreationModal';
import {
    getBlocks, createBlock, updateBlock, deleteBlock,
    getCoverLetters, updateCoverLetter, deleteCoverLetter
} from '../api/coverLetter';

// --- Types ---
type TabType = 'RESUME' | 'BLOCKS';
type FollowType = 'FOLLOWER' | 'FOLLOWING';

// Mock Data for Follow Modal
const mockFollowList = [
    { id: 1, nickname: 'coding_god', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', isFollowing: true },
    { id: 2, nickname: 'dev_master', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', isFollowing: false },
    { id: 3, nickname: 'frontend_wiz', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Baby', isFollowing: true },
    { id: 4, nickname: 'algo_pro', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grandma', isFollowing: false },
    { id: 5, nickname: 'design_guru', profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack', isFollowing: true },
];

const MyPage = () => {
    const navigate = useNavigate();

    // --- State ---
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [streak, setStreak] = useState<UserStreak[]>([]);
    const [appliers, setAppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [resumeTab, setResumeTab] = useState<TabType>('RESUME');

    // Follow Modal State
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [followModalType, setFollowModalType] = useState<FollowType>('FOLLOWER');
    const [followList, setFollowList] = useState(mockFollowList);
    const [stats, setStats] = useState({ follower: 120, following: 85 });

    // Block State
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [blocks, setBlocks] = useState<any[]>([]);
    const [editingBlock, setEditingBlock] = useState<any | null>(null);

    // Cover Letter State
    const [coverLetters, setCoverLetters] = useState<any[]>([]);
    const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
    const [editingCoverLetter, setEditingCoverLetter] = useState<any | null>(null);
    const [coverLetterForm, setCoverLetterForm] = useState({ company: '', role: '', status: 'pending' });

    // --- Fetch Data ---
    const fetchBlocksData = async () => {
        try {
            const res = await getBlocks();
            setBlocks(res.data || []);
        } catch (error) {
            console.error("Failed to fetch blocks", error);
        }
    };

    const fetchCoverLettersData = async () => {
        try {
            const res = await getCoverLetters();
            setCoverLetters(res.data || []);
        } catch (error) {
            console.error("Failed to fetch cover letters", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userData, streakData, applierData] = await Promise.all([
                    userApi.getUserProfile(1),
                    userApi.getStreak(1),
                    userApi.getAppliers(1)
                ]);
                setProfile(userData);
                setStreak(streakData);
                setAppliers(applierData);

                await Promise.all([fetchBlocksData(), fetchCoverLettersData()]);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleLoginDemo = () => setIsLoggedIn(true);

    // --- Follow Logic ---
    const toggleFollow = (id: number) => {
        setFollowList(prev => prev.map(user =>
            user.id === id ? { ...user, isFollowing: !user.isFollowing } : user
        ));
    };

    const openFollowModal = (type: FollowType) => {
        setFollowModalType(type);
        setIsFollowModalOpen(true);
        setFollowList([...mockFollowList].sort(() => Math.random() - 0.5));
    };

    // --- Block Handlers ---
    const handleOpenBlockModal = (block: any | null = null) => {
        setEditingBlock(block);
        setIsBlockModalOpen(true);
    };

    const handleSaveBlock = async (blockData: { title: string; content: string; category: string; tags: string[] }) => {
        try {
            if (editingBlock) {
                // Update
                await updateBlock(editingBlock.id, blockData);
            } else {
                // Create
                await createBlock(blockData);
            }
            await fetchBlocksData();
            setIsBlockModalOpen(false);
            setEditingBlock(null);
        } catch (error) {
            console.error("Failed to save block", error);
        }
    };

    const handleDeleteBlock = async (e: React.MouseEvent, id: string | number) => {
        e.stopPropagation();
        if (window.confirm("정말 이 블록을 삭제하시겠습니까?")) {
            try {
                await deleteBlock(id);
                await fetchBlocksData();
            } catch (error) {
                console.error("Failed to delete block", error);
            }
        }
    };

    // --- Cover Letter Handlers ---
    const handleOpenCoverLetterModal = (cl: any) => {
        setEditingCoverLetter(cl);
        setCoverLetterForm({
            company: cl.company,
            role: cl.role,
            status: cl.status || 'pending'
        });
        setIsCoverLetterModalOpen(true);
    };

    const handleSaveCoverLetter = async () => {
        if (!editingCoverLetter) return;
        try {
            await updateCoverLetter(editingCoverLetter.id, coverLetterForm);
            await fetchCoverLettersData();
            setIsCoverLetterModalOpen(false);
            setEditingCoverLetter(null);
        } catch (error) {
            console.error("Failed to update cover letter", error);
        }
    };

    const handleDeleteCoverLetter = async (e: React.MouseEvent, id: string | number) => {
        e.stopPropagation();
        if (window.confirm("정말 이 자소서를 삭제하시겠습니까?")) {
            try {
                await deleteCoverLetter(id);
                await fetchCoverLettersData();
            } catch (error) {
                console.error("Failed to delete cover letter", error);
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mr-2"></div>
            Loading...
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 relative font-sans pt-20">

            {/* --- Follow Modal --- */}
            {isFollowModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100">
                            <div className="w-8"></div>
                            <h3 className="font-bold text-lg text-slate-800">
                                {followModalType === 'FOLLOWER' ? '팔로워' : '팔로잉'}
                            </h3>
                            <button onClick={() => setIsFollowModalOpen(false)} className="w-8 flex justify-end text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-3 border-b border-slate-50">
                            <input type="text" placeholder="검색" className="w-full bg-slate-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200" />
                        </div>
                        <div className="overflow-y-auto p-2">
                            {followList.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                                            <img src={user.profileImage} alt={user.nickname} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800">{user.nickname}</p>
                                            <p className="text-xs text-slate-400">Junior Developer</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleFollow(user.id)}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors border ${user.isFollowing
                                            ? 'bg-transparent border-slate-300 text-slate-600 hover:border-slate-400'
                                            : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                    >
                                        {user.isFollowing ? '팔로잉' : '팔로우'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- Cover Letter Edit Modal --- */}
            {isCoverLetterModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
                        <h3 className="text-lg font-bold mb-4">자소서 정보 수정</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">기업명</label>
                                <input
                                    type="text"
                                    value={coverLetterForm.company}
                                    onChange={(e) => setCoverLetterForm({ ...coverLetterForm, company: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">직무</label>
                                <input
                                    type="text"
                                    value={coverLetterForm.role}
                                    onChange={(e) => setCoverLetterForm({ ...coverLetterForm, role: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">상태</label>
                                <select
                                    value={coverLetterForm.status}
                                    onChange={(e) => setCoverLetterForm({ ...coverLetterForm, status: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                                >
                                    <option value="pending">작성중</option>
                                    <option value="pass">합격</option>
                                    <option value="fail">불합격</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setIsCoverLetterModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold">취소</button>
                            <button onClick={handleSaveCoverLetter} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">저장</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Login Barrier --- */}
            {!isLoggedIn && (
                <div className="absolute inset-0 z-50 backdrop-blur-md bg-white/30 flex flex-col items-center justify-center fixed top-0 h-full">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md border border-slate-100">
                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-slate-800">로그인이 필요해요</h2>
                        <p className="text-slate-500 mb-8">나의 활동 기록과 자소서를 관리하려면<br />로그인이 필요합니다.</p>
                        <button onClick={handleLoginDemo} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200">
                            로그인 / 회원가입
                        </button>
                    </div>
                </div>
            )}

            <div className={`max-w-7xl mx-auto px-4 lg:px-8 transition-opacity duration-500 ${!isLoggedIn ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                {/* --- Header --- */}
                <header className="mb-10 flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white group-hover:border-indigo-100 transition-colors">
                                <img src={profile?.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-indigo-600 shadow-sm transition-colors">
                                <Settings className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">{profile?.nickname}님, 반가워요! 👋</h1>
                            <p className="text-slate-500 mb-3 text-sm">{profile?.bio || "오늘도 합격을 향해 달려볼까요?"}</p>
                            <div className="flex gap-4 text-sm">
                                <button onClick={() => openFollowModal('FOLLOWER')} className="flex gap-1 hover:text-indigo-600 transition-colors">
                                    <span className="font-bold text-slate-900">{stats.follower}</span>
                                    <span className="text-slate-500">팔로워</span>
                                </button>
                                <button onClick={() => openFollowModal('FOLLOWING')} className="flex gap-1 hover:text-indigo-600 transition-colors">
                                    <span className="font-bold text-slate-900">{stats.following}</span>
                                    <span className="text-slate-500">팔로잉</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                            <span className="text-xs text-slate-400 font-medium uppercase">Total Streak</span>
                            <span className="text-xl font-bold text-indigo-600">124일</span>
                        </div>
                        <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
                            <span className="text-xs text-slate-400 font-medium uppercase">Applications</span>
                            <span className="text-xl font-bold text-slate-800">{appliers.length}개</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* --- Left Column --- */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* 1. Streak */}
                        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-green-500" />
                                    <span>활동 스트릭</span>
                                </h2>
                                <button className="text-xs font-medium text-slate-400 hover:text-slate-600 flex items-center">
                                    자세히 보기 <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="w-full overflow-x-auto scrollbar-hide">
                                <div className="flex gap-1 min-w-max">
                                    {Array.from({ length: 52 }).map((_, weekIdx) => (
                                        <div key={weekIdx} className="flex flex-col gap-1">
                                            {Array.from({ length: 7 }).map((_, dayIdx) => {
                                                const level = Math.floor(Math.random() * 10) > 6 ? Math.floor(Math.random() * 5) : 0;
                                                const colorClass = ['bg-slate-100', 'bg-green-100', 'bg-green-300', 'bg-green-500', 'bg-green-700'][level];
                                                return <div key={dayIdx} className={`w-2.5 h-2.5 rounded-[2px] ${colorClass}`} />
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* 2. Timeline */}
                        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-indigo-500" />
                                    <span>이력 타임라인</span>
                                </h2>
                                <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="relative pl-4 border-l-2 border-slate-100 space-y-8 ml-2">
                                {/* Static Timeline Items */}
                                <div className="relative">
                                    <span className="absolute -left-[21px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-500 shadow-sm"></span>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                                        <h3 className="font-bold text-slate-800">삼성청년SW아카데미 11기</h3>
                                        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">2024.01 - 2024.12</span>
                                    </div>
                                    <p className="text-sm text-slate-600">Web/Mobile Track 수료 (우수 교육생 표창)</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[21px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-slate-300"></span>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                                        <h3 className="font-bold text-slate-800">한국대학교 컴퓨터공학부 졸업</h3>
                                        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">2018.03 - 2024.02</span>
                                    </div>
                                    <p className="text-sm text-slate-600">학점 4.2/4.5 (졸업프로젝트 최우수상)</p>
                                </div>
                            </div>
                        </section>

                        {/* 3. Cover Letter & Blocks */}
                        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                            <div className="flex border-b border-slate-100">
                                <button
                                    onClick={() => setResumeTab('RESUME')}
                                    className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${resumeTab === 'RESUME' ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    자소서 관리
                                </button>
                                <button
                                    onClick={() => setResumeTab('BLOCKS')}
                                    className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${resumeTab === 'BLOCKS' ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    자소서 블록 (글감)
                                </button>
                            </div>

                            <div className="p-6">
                                {resumeTab === 'RESUME' ? (
                                    <div className="space-y-3">
                                        {coverLetters.length > 0 ? coverLetters.map((item, idx) => (
                                            <div key={item.id || idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all bg-white group">
                                                <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => navigate(`/coverletter/${item.id}`)}>
                                                    <div className={`w-1.5 h-12 rounded-full ${item.status === 'pass' ? 'bg-green-500' :
                                                        item.status === 'fail' ? 'bg-red-400' : 'bg-slate-300'
                                                        }`}></div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                            {item.company} 자소서
                                                        </h4>
                                                        <p className="text-xs text-slate-500">{item.role} • {item.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {item.status === 'pass' && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">합격</span>}
                                                    {item.status === 'fail' && <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-md">불합격</span>}
                                                    {item.status === 'pending' && <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">작성중</span>}

                                                    {/* Edit Button */}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleOpenCoverLetterModal(item); }}
                                                        className="p-1.5 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors ml-2"
                                                        title="수정"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={(e) => handleDeleteCoverLetter(e, item.id)}
                                                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="삭제"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-10 text-slate-400">자소서 내역이 없습니다.</div>
                                        )}
                                        <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-medium hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2">
                                            <Plus className="w-4 h-4" /> 새 자소서 작성하기
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {blocks.length > 0 ? (
                                            blocks.map((block) => (
                                                <div key={block.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-md transition-shadow group relative">

                                                    {/* Block Actions */}
                                                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-sm">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleOpenBlockModal(block); }}
                                                            className="p-1 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-indigo-50"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDeleteBlock(e, block.id)}
                                                            className="p-1 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    <h4 className="font-bold text-slate-800 mb-2 truncate pr-16 group-hover:text-indigo-600 transition-colors">{block.title}</h4>
                                                    <p className="text-xs text-slate-600 line-clamp-3 mb-2 h-[42px] leading-relaxed">
                                                        {block.content}
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {block.tags && block.tags.map((tag: string, idx: number) => (
                                                            <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 text-[10px] rounded-md">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-full text-center py-8 text-slate-400 text-sm">
                                                아직 등록된 블록이 없습니다.
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleOpenBlockModal(null)}
                                            className="h-full min-h-[120px] border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-medium hover:border-indigo-300 hover:text-indigo-500 transition-colors flex flex-col items-center justify-center gap-2"
                                        >
                                            <Plus className="w-6 h-6" />
                                            <span>새 블록 추가</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Modals */}
                        <BlockCreationModal
                            isOpen={isBlockModalOpen}
                            onClose={() => { setIsBlockModalOpen(false); setEditingBlock(null); }}
                            onSave={handleSaveBlock}
                            initialData={editingBlock} // Pass editing data
                        />
                    </div>

                    {/* --- Right Column --- */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* 4. Awards - Static */}
                        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-yellow-500" />
                                <span>수상 및 자격증</span>
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <div className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">삼성청년SW아카데미 우수상</p>
                                        <p className="text-xs text-slate-500">2024.12 • 삼성전자</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. Apps */}
                        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-500" />
                                <span>지원 현황</span>
                            </h2>
                            <div className="space-y-4">
                                {appliers.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400 text-sm">아직 지원 내역이 없습니다.</div>
                                ) : (
                                    appliers.map((app, idx) => (
                                        <div key={idx} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                                                    {app.company[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{app.company}</p>
                                                    <p className="text-xs text-slate-500">{app.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{app.status}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <button onClick={() => navigate('/recruitments')} className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                                공고 보러가기
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;