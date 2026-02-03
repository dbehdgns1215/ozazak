import React, { useEffect, useState, useMemo } from 'react';
import {
    User, Award, FileText, Calendar, Activity, Briefcase, Settings,
    LogOut, Lock, ChevronRight, CheckCircle2, XCircle, Plus, X,
    Trash2, Edit2, Pencil
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
    getUserProfile, getUserStreak, getFollowers, getFollowees,
    UserProfile, UserStreak, getUserRecords, getUserAwards, getUserCertifications,
    followUser, unfollowUser,
    createUserRecord, updateUserRecord, deleteUserRecord,
    createUserAward, updateUserAward, deleteUserAward,
    createUserCertification, updateUserCertification, deleteUserCertification
} from '../api/user';
import { useNavigate, useParams } from 'react-router-dom';
import BlockCreationModal from '../components/BlockCreationModal';
import {
    getBlocks, createBlock, updateBlock, deleteBlock,
    getCoverLetters, updateCoverLetter, deleteCoverLetter
} from '../api/coverLetter';

type TabType = 'RESUME' | 'BLOCKS';
type FollowType = 'FOLLOWER' | 'FOLLOWING';

// --- Streak Graph Component ---
const StreakGraph = ({ streakData }: { streakData: UserStreak[] }) => {
    const today = new Date();

    const streakMap = useMemo(() => {
        // streakData가 배열이 아니면 빈 배열로 처리
        const safeData = Array.isArray(streakData) ? streakData : [];
        return new Map(safeData.map(s => [s.date, s.value]));
    }, [streakData]);

    const getLevel = (count: number) => {
        if (!count || count === 0) return 0;
        if (count < 2) return 1;
        if (count < 4) return 2;
        if (count < 6) return 3;
        return 4;
    };

    const colorClasses = ['bg-slate-100', 'bg-green-100', 'bg-green-300', 'bg-green-500', 'bg-green-700'];

    // Calculate days for current year (Jan 1 to Dec 31)
    const currentYear = today.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1); // Jan 1
    const endOfYear = new Date(currentYear, 11, 31); // Dec 31
    const daysInYear = Math.ceil((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const days = Array.from({ length: daysInYear }).map((_, i) => {
        const date = new Date(startOfYear);
        date.setDate(startOfYear.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        return {
            date: dateString,
            value: streakMap.get(dateString) || 0,
        };
    });

    const firstDayOfWeek = new Date(days[0].date).getDay();
    const paddedDays = [...Array(firstDayOfWeek).fill(null), ...days];

    const colorStyles = [
        { backgroundColor: '#f1f5f9' }, // slate-100
        { backgroundColor: '#dcfce7' }, // green-100
        { backgroundColor: '#86efac' }, // green-300
        { backgroundColor: '#22c55e' }, // green-500
        { backgroundColor: '#15803d' }, // green-700
    ];

    return (
        <div className="w-full overflow-x-auto scrollbar-hide">
            <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-max">
                {paddedDays.map((day, index) => {
                    if (!day) {
                        return <div key={`pad-${index}`} style={{ width: '10px', height: '10px', borderRadius: '2px' }} />;
                    }
                    const level = getLevel(day.value);
                    const style = { ...colorStyles[level], width: '10px', height: '10px', borderRadius: '2px' };
                    return (
                        <div
                            key={day.date}
                            style={style}
                            title={`${day.date}: ${day.value} activities`}
                        />
                    );
                })}
            </div>
        </div>
    );
};


const MyPage = () => {
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams(); // Get user ID from URL
    const { user, isAuthenticated } = useAuth();

    // Determine which user's data to show
    const targetUserId = useMemo(() => {
        if (paramUserId) return parseInt(paramUserId);
        return user?.accountId;
    }, [paramUserId, user]);

    const isOwnProfile = !paramUserId || (user?.accountId && parseInt(paramUserId) === user.accountId);

    // --- State ---
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [streak, setStreak] = useState<UserStreak[]>([]);
    const [records, setRecords] = useState<any[]>([]);
    const [awards, setAwards] = useState<any[]>([]);
    const [certifications, setCertifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [resumeTab, setResumeTab] = useState<TabType>('RESUME');

    // Follow Modal State
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [followModalType, setFollowModalType] = useState<FollowType>('FOLLOWER');
    const [followList, setFollowList] = useState<any[]>([]);

    // Block State
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
    const [blocks, setBlocks] = useState<any[]>([]);
    const [editingBlock, setEditingBlock] = useState<any | null>(null);

    // Cover Letter State
    const [coverLetters, setCoverLetters] = useState<any[]>([]);
    const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
    const [editingCoverLetter, setEditingCoverLetter] = useState<any | null>(null);
    const [coverLetterForm, setCoverLetterForm] = useState({ company: '', role: '', status: 'pending' });

    // --- CRUD States ---
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [recordForm, setRecordForm] = useState({ title: '', description: '', startDate: '', endDate: '', organization: '' });
    const [editingRecordId, setEditingRecordId] = useState<number | null>(null);

    const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
    const [awardForm, setAwardForm] = useState({ title: '', date: '', organization: '', description: '' });
    const [editingAwardId, setEditingAwardId] = useState<number | null>(null);

    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [certForm, setCertForm] = useState({ name: '', issuingOrganization: '', issueDate: '', expirationDate: '' });
    const [editingCertId, setEditingCertId] = useState<number | null>(null);

    // --- Fetch Data ---
    const [isFollowingTarget, setIsFollowingTarget] = useState(false);

    // --- Derived State ---
    const activeDaysCount = useMemo(() => {
        return (Array.isArray(streak) ? streak : []).filter(s => s.value > 0).length;
    }, [streak]);

    // --- Helper Functions ---
    const fetchBlocksData = async () => {
        try {
            const res: any = await getBlocks();
            setBlocks(res.data || []);
        } catch (error) {
            console.error("Failed to fetch blocks", error);
            setBlocks([]);
        }
    };

    const fetchCoverLettersData = async () => {
        try {
            const res: any = await getCoverLetters();
            setCoverLetters(res.data || []);
        } catch (error) {
            console.error("Failed to fetch cover letters", error);
            setCoverLetters([]);
        }
    };

    // --- Effects ---
    useEffect(() => {
        if (!targetUserId) {
            setLoading(false);
            return;
        }

        // Check isFollowing if viewing other's profile
        if (!isOwnProfile && user?.accountId && targetUserId) {
            getFollowees(user.accountId).then((following: any[]) => {
                const found = following.find((f: any) => f.id === targetUserId);
                setIsFollowingTarget(!!found);
            });
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [
                    profileData,
                    streakData,
                    recordsData,
                    awardsData,
                    certificationsData,
                    blocksData,
                    coverLettersData
                ] = await Promise.all([
                    getUserProfile(targetUserId).catch((err: any) => { console.error(err); return null; }),
                    getUserStreak(targetUserId).then((res: any) => Array.isArray(res) ? res : (res?.data || [])).catch(() => []),
                    getUserRecords(targetUserId).catch(() => []),
                    getUserAwards(targetUserId).catch(() => []),
                    getUserCertifications(targetUserId).catch(() => []),
                    getBlocks(0, 100).catch(() => []),
                    getCoverLetters().catch(() => [])
                ]);

                setProfile(profileData);
                setStreak(streakData || []);
                setRecords(recordsData || []);
                setAwards(awardsData || []);
                setCertifications(certificationsData || []);
                if (isOwnProfile) {
                    // Robust extraction of arrays
                    const extractArray = (res: any) => {
                        if (Array.isArray(res)) return res;
                        if (res && Array.isArray(res.data)) return res.data;
                        if (res && Array.isArray(res.items)) return res.items;
                        return [];
                    };
                    setBlocks(extractArray(blocksData));
                    setCoverLetters(extractArray(coverLettersData));
                }

            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [targetUserId, isOwnProfile, user]);

    // --- Follow Logic ---
    const toggleFollow = async (id: number) => {
        if (!user?.accountId) return;

        // If toggling the main target user (from Header button)
        if (id === targetUserId && !isOwnProfile) {
            try {
                if (isFollowingTarget) {
                    await unfollowUser(user.accountId, id);
                    setIsFollowingTarget(false);
                    setProfile((prev: UserProfile | null) => prev ? { ...prev, followerCount: Math.max(0, (prev.followerCount || 0) - 1) } : null);
                } else {
                    await followUser(user.accountId, id);
                    setIsFollowingTarget(true);
                    setProfile((prev: UserProfile | null) => prev ? { ...prev, followerCount: (prev.followerCount || 0) + 1 } : null);
                }
            } catch (error) {
                console.error('Main follow toggle failed:', error);
                alert('작업에 실패했습니다.');
            }
            return;
        }

        const targetUser = followList.find(u => u.id === id);
        if (!targetUser) return;

        try {
            if (targetUser.isFollowing) {
                await unfollowUser(user.accountId, id);
                if (isOwnProfile && followModalType === 'FOLLOWING') {
                    setProfile((prev: UserProfile | null) => prev ? { ...prev, followeeCount: Math.max(0, (prev.followeeCount || 0) - 1) } : null);
                }
            } else {
                await followUser(user.accountId, id);
                if (isOwnProfile) {
                    setProfile((prev: UserProfile | null) => prev ? { ...prev, followeeCount: (prev.followeeCount || 0) + 1 } : null);
                }
            }
            setFollowList(prev => prev.map(u =>
                u.id === id ? { ...u, isFollowing: !u.isFollowing } : u
            ));
        } catch (error) {
            console.error('Failed to toggle follow:', error);
            alert('팔로우/언팔로우 중 오류가 발생했습니다.');
        }
    };

    const openFollowModal = async (type: FollowType) => {
        if (!targetUserId) return;
        setFollowModalType(type);
        setFollowList([]);
        setIsFollowModalOpen(true);
        try {
            const fetcher = type === 'FOLLOWER' ? getFollowers : getFollowees;
            const data = await fetcher(targetUserId);
            setFollowList(data || []);
        } catch (error) {
            console.error(`Failed to fetch ${type}`, error);
            setFollowList([]);
        }
    };

    // --- Block Handlers ---
    const handleOpenBlockModal = (block: any | null = null) => {
        setEditingBlock(block);
        setIsBlockModalOpen(true);
    };

    const handleSaveBlock = async (blockData: { title: string; content: string; category: string; tags: string[] }) => {
        try {
            if (editingBlock) {
                await updateBlock(editingBlock.id, blockData);
            } else {
                await createBlock(blockData);
            }
            const res: any = await getBlocks();
            setBlocks(res.data || []);
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
                const res: any = await getBlocks();
                setBlocks(res.data || []);
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
            const res: any = await getCoverLetters();
            setCoverLetters(res.data || []);
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
                const res: any = await getCoverLetters();
                setCoverLetters(res.data || []);
            } catch (error) {
                console.error("Failed to delete cover letter", error);
            }
        }
    };

    // --- Record Handlers ---
    const handleOpenRecordModal = (record: any = null) => {
        if (record) {
            setRecordForm({
                title: record.title || record.name,
                description: record.description || record.details || '',
                startDate: record.startDate || '',
                endDate: record.endDate || '',
                organization: record.organization || ''
            });
            setEditingRecordId(record.id);
        } else {
            setRecordForm({ title: '', description: '', startDate: '', endDate: '', organization: '' });
            setEditingRecordId(null);
        }
        setIsRecordModalOpen(true);
    };

    const handleSaveRecord = async () => {
        if (!user?.accountId) return;
        try {
            if (editingRecordId) {
                await updateUserRecord(user.accountId, editingRecordId, recordForm);
            } else {
                await createUserRecord(user.accountId, recordForm);
            }
            const res = await getUserRecords(user.accountId);
            setRecords(res || []);
            setIsRecordModalOpen(false);
        } catch (error) { console.error(error); alert('저장 실패'); }
    };

    const handleDeleteRecord = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!user?.accountId) return;
        if (window.confirm('삭제하시겠습니까?')) {
            try {
                await deleteUserRecord(user.accountId, id);
                const res = await getUserRecords(user.accountId);
                setRecords(res || []);
            } catch (e) { console.error(e); }
        }
    };

    // --- Award Handlers ---
    const handleOpenAwardModal = (award: any = null) => {
        if (award) {
            setAwardForm({
                title: award.title || award.name,
                date: award.date || '',
                organization: award.organization || '',
                description: award.description || ''
            });
            setEditingAwardId(award.id);
        } else {
            setAwardForm({ title: '', date: '', organization: '', description: '' });
            setEditingAwardId(null);
        }
        setIsAwardModalOpen(true);
    };

    const handleSaveAward = async () => {
        if (!user?.accountId) return;
        try {
            if (editingAwardId) {
                await updateUserAward(user.accountId, editingAwardId, awardForm);
            } else {
                await createUserAward(user.accountId, awardForm);
            }
            const res = await getUserAwards(user.accountId);
            setAwards(res || []);
            setIsAwardModalOpen(false);
        } catch (error) { console.error(error); alert('저장 실패'); }
    };

    const handleDeleteAward = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!user?.accountId) return;
        if (window.confirm('삭제하시겠습니까?')) {
            try {
                await deleteUserAward(user.accountId, id);
                const res = await getUserAwards(user.accountId);
                setAwards(res || []);
            } catch (e) { console.error(e); }
        }
    };

    // --- Cetification Handlers ---
    const handleOpenCertModal = (cert: any = null) => {
        if (cert) {
            setCertForm({
                name: cert.name || cert.title,
                issuingOrganization: cert.issuingOrganization || cert.issuer || '',
                issueDate: cert.issueDate || cert.date || '',
                expirationDate: cert.expirationDate || ''
            });
            setEditingCertId(cert.id);
        } else {
            setCertForm({ name: '', issuingOrganization: '', issueDate: '', expirationDate: '' });
            setEditingCertId(null);
        }
        setIsCertModalOpen(true);
    };

    const handleSaveCert = async () => {
        if (!user?.accountId) return;
        try {
            if (editingCertId) {
                await updateUserCertification(user.accountId, editingCertId, certForm);
            } else {
                await createUserCertification(user.accountId, certForm);
            }
            const res = await getUserCertifications(user.accountId);
            setCertifications(res || []);
            setIsCertModalOpen(false);
        } catch (error) { console.error(error); alert('저장 실패'); }
    };

    const handleDeleteCert = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!user?.accountId) return;
        if (window.confirm('삭제하시겠습니까?')) {
            try {
                await deleteUserCertification(user.accountId, id);
                const res = await getUserCertifications(user.accountId);
                setCertifications(res || []);
            } catch (e) { console.error(e); }
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
                        <div className="overflow-y-auto p-2">
                            {followList.length > 0 ? followList.map(followUser => (
                                <div
                                    key={followUser.id}
                                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl cursor-pointer"
                                    onClick={() => {
                                        navigate(`/users/${followUser.id}`);
                                        setIsFollowModalOpen(false);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                            {followUser.profileImage && followUser.profileImage !== 'default_img.png' ? (
                                                <img src={followUser.profileImage} alt={followUser.nickname} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <User size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <span className="font-medium text-slate-700">{followUser.nickname}</span>
                                    </div>
                                    {/* Show follow button only if it's not me */}
                                    {user?.accountId !== followUser.id && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent navigation when clicking button
                                                toggleFollow(followUser.id);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${followUser.isFollowing
                                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                }`}
                                        >
                                            {followUser.isFollowing ? '팔로잉' : '팔로우'}
                                        </button>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center py-10 text-slate-400">
                                    {followModalType === 'FOLLOWER' ? '팔로워가 없습니다.' : '팔로잉하는 사용자가 없습니다.'}
                                </div>
                            )}
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

            {/* --- Record Modal --- */}
            {isRecordModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-slate-800">{editingRecordId ? '이력 수정' : '이력 추가'}</h3>
                            <button onClick={() => setIsRecordModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">제목/활동명</label>
                                <input
                                    type="text"
                                    value={recordForm.title}
                                    onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-bold text-slate-800"
                                    placeholder="예: SSAFY 14기"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">소속 (선택)</label>
                                <input
                                    type="text"
                                    value={recordForm.organization}
                                    onChange={(e) => setRecordForm({ ...recordForm, organization: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                                    placeholder="예: 삼성청년SW아카데미"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-1">시작일</label>
                                    <input
                                        type="month"
                                        value={recordForm.startDate}
                                        onChange={(e) => setRecordForm({ ...recordForm, startDate: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-1">종료일 (진행중이면 비워두세요)</label>
                                    <input
                                        type="month"
                                        value={recordForm.endDate}
                                        onChange={(e) => setRecordForm({ ...recordForm, endDate: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">설명</label>
                                <textarea
                                    value={recordForm.description}
                                    onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-32 resize-none outline-none"
                                    placeholder="어떤 활동을 했는지 간단히 적어보세요."
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setIsRecordModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold">취소</button>
                            <button onClick={handleSaveRecord} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">저장</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Award Modal --- */}
            {isAwardModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-slate-800">{editingAwardId ? '수상 수정' : '수상 추가'}</h3>
                            <button onClick={() => setIsAwardModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">수상명</label>
                                <input
                                    type="text"
                                    value={awardForm.title}
                                    onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                    placeholder="예: 최우수상"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">수여 기관</label>
                                <input
                                    type="text"
                                    value={awardForm.organization}
                                    onChange={(e) => setAwardForm({ ...awardForm, organization: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">수상일</label>
                                <input
                                    type="date"
                                    value={awardForm.date}
                                    onChange={(e) => setAwardForm({ ...awardForm, date: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">설명(선택)</label>
                                <textarea
                                    value={awardForm.description}
                                    onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-24 resize-none outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setIsAwardModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold">취소</button>
                            <button onClick={handleSaveAward} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">저장</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Cert Modal --- */}
            {isCertModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-slate-800">{editingCertId ? '자격증 수정' : '자격증 추가'}</h3>
                            <button onClick={() => setIsCertModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">자격증명</label>
                                <input
                                    type="text"
                                    value={certForm.name}
                                    onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">발급 기관</label>
                                <input
                                    type="text"
                                    value={certForm.issuingOrganization}
                                    onChange={(e) => setCertForm({ ...certForm, issuingOrganization: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">취득일</label>
                                <input
                                    type="date"
                                    value={certForm.issueDate}
                                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setIsCertModalOpen(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold">취소</button>
                            <button onClick={handleSaveCert} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">저장</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Login Barrier --- */}
            {!isAuthenticated && (
                <div className="absolute inset-0 z-50 backdrop-blur-md bg-white/30 flex flex-col items-center justify-center fixed top-0 h-full">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md border border-slate-100">
                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-slate-800">로그인이 필요해요</h2>
                        <p className="text-slate-500 mb-8">나의 활동 기록과 자소서를 관리하려면<br />로그인이 필요합니다.</p>
                        <button onClick={() => navigate('/signin')} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200">
                            로그인 / 회원가입
                        </button>
                    </div>
                </div>
            )}

            <div className={`max-w-7xl mx-auto px-4 lg:px-8 transition-opacity duration-500 ${!isAuthenticated ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                {/* --- Header --- */}
                <header className="mb-10 flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white group-hover:border-indigo-100 transition-colors">
                                <img src={profile?.img || profile?.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-indigo-600 shadow-sm transition-colors">
                                <Settings className="w-4 h-4" />
                            </button>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">{profile?.name || profile?.nickname || '...'}님, 반가워요! 👋</h1>
                            <p className="text-slate-500 mb-3 text-sm">{profile?.bio || "오늘도 합격을 향해 달려볼까요?"}</p>
                            <div className="flex gap-4 text-sm">
                                <button onClick={() => openFollowModal('FOLLOWER')} className="flex gap-1 hover:text-indigo-600 transition-colors">
                                    <span className="font-bold text-slate-900">{profile?.followerCount ?? profile?.followersCount ?? 0}</span>
                                    <span className="text-slate-500">팔로워</span>
                                </button>
                                <button onClick={() => openFollowModal('FOLLOWING')} className="flex gap-1 hover:text-indigo-600 transition-colors">
                                    <span className="font-bold text-slate-900">{profile?.followeeCount ?? profile?.followingsCount ?? 0}</span>
                                    <span className="text-slate-500">팔로잉</span>
                                </button>
                            </div>
                            {!isOwnProfile && targetUserId && (
                                <button
                                    onClick={() => toggleFollow(targetUserId)}
                                    className={`mt-4 w-full py-2 rounded-lg font-bold text-sm transition-colors ${isFollowingTarget
                                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
                                        }`}
                                >
                                    {isFollowingTarget ? '팔로잉' : '팔로우'}
                                </button>
                            )}
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
                                <div className="px-4 py-2 bg-green-50 rounded-xl border border-green-200 shadow-sm">
                                    <span className="text-xs text-green-600 font-medium uppercase">활동한 날</span>
                                    <span className="text-2xl font-bold text-green-600 ml-2">{activeDaysCount}일</span>
                                </div>
                            </div>
                            <StreakGraph streakData={streak} />
                        </section>




                        {/* 3. Cover Letter & Blocks (Only for Owner) */}
                        {isOwnProfile && (
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
                                                        <div className={`w-1.5 h-12 rounded-full ${item.isPassed === true ? 'bg-green-500' :
                                                            item.isPassed === false ? 'bg-red-400' : 'bg-slate-300'
                                                            }`}></div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                                {item.companyName || item.company} 자소서
                                                            </h4>
                                                            <p className="text-xs text-slate-500">{item.title || item.role} • {new Date(item.createdAt || item.date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {item.isPassed === true && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">합격</span>}
                                                        {item.isPassed === false && <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-md">불합격</span>}
                                                        {item.status === 'pending' && <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">작성중</span>}

                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleOpenCoverLetterModal(item); }}
                                                            className="p-1.5 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors ml-2"
                                                            title="수정"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
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
                        )}

                        <BlockCreationModal
                            isOpen={isBlockModalOpen}
                            onClose={() => { setIsBlockModalOpen(false); setEditingBlock(null); }}
                            onSave={handleSaveBlock}
                            initialData={editingBlock}
                        />
                    </div>

                    {/* --- Right Column --- */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* 2. Timeline (Moved) */}
                        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                                    <Briefcase className="w-5 h-5 text-indigo-500" />
                                    <span>이력 타임라인</span>
                                </h2>
                                {isOwnProfile && (
                                    <button type="button" onClick={() => handleOpenRecordModal(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-colors">
                                        <Plus className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <div className="relative pl-4 border-l-2 border-slate-100 space-y-8 ml-2">
                                {records.length > 0 ? (
                                    records.map((record, idx) => (
                                        <div key={record.id || idx} className="relative group">
                                            <span className={`absolute -left-[21px] top-1.5 w-4 h-4 rounded-full bg-white border-4 ${idx === 0 ? 'border-indigo-500' : 'border-slate-300'} shadow-sm transition-colors group-hover:border-indigo-400`}></span>
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
                                                <div>
                                                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{record.title || record.name}</h3>
                                                    {record.organization && <span className="text-xs text-slate-500 block mb-1">{record.organization}</span>}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md whitespace-nowrap">
                                                        {record.startDate} {record.endDate ? `- ${record.endDate}` : ''}
                                                    </span>
                                                    {isOwnProfile && (
                                                        <div className="flex gap-1">
                                                            <button onClick={() => handleOpenRecordModal(record)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
                                                            <button onClick={(e) => handleDeleteRecord(e, record.id)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">{record.description || record.details || ''}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-400 text-sm">
                                        아직 등록된 이력이 없습니다.
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* 3. Awards & Certifications */}
                        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    <span>수상 및 자격증</span>
                                </h2>
                                {isOwnProfile && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenAwardModal()} className="px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center gap-1">
                                            <Plus size={14} /> 수상
                                        </button>
                                        <button onClick={() => handleOpenCertModal()} className="px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center gap-1">
                                            <Plus size={14} /> 자격증
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Awards */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">🏆 수상 이력</h3>
                                    <div className="space-y-3">
                                        {awards.length > 0 ? awards.map((award, idx) => (
                                            <div key={award.id || idx} className="flex items-start justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/30 transition-colors group">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-sm">{award.title || award.name}</h4>
                                                    <p className="text-xs text-slate-500 mb-1">{award.organization || award.issuer} • {award.date}</p>
                                                    {award.description && <p className="text-xs text-slate-600">{award.description}</p>}
                                                </div>
                                                {isOwnProfile && (
                                                    <div className="flex gap-1">
                                                        <button onClick={() => handleOpenAwardModal(award)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
                                                        <button onClick={(e) => handleDeleteAward(e, award.id)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                                    </div>
                                                )}
                                            </div>
                                        )) : <div className="text-xs text-slate-400 py-2">등록된 수상 이력이 없습니다.</div>}
                                    </div>
                                </div>

                                {/* Certifications */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">📜 자격증</h3>
                                    <div className="space-y-3">
                                        {certifications.length > 0 ? certifications.map((cert, idx) => (
                                            <div key={cert.id || idx} className="flex items-start justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/30 transition-colors group">
                                                <div>
                                                    <h4 className="font-bold text-slate-800 text-sm">{cert.name}</h4>
                                                    <p className="text-xs text-slate-500 mb-1">{cert.issuingOrganization || cert.issuer} • {cert.issueDate}</p>
                                                    {cert.description && <p className="text-xs text-slate-600">{cert.description}</p>}
                                                </div>
                                                {isOwnProfile && (
                                                    <div className="flex gap-1">
                                                        <button onClick={() => handleOpenCertModal(cert)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
                                                        <button onClick={(e) => handleDeleteCert(e, cert.id)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                                    </div>
                                                )}
                                            </div>
                                        )) : <div className="text-xs text-slate-400 py-2">등록된 자격증이 없습니다.</div>}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. Apps */}
                        {/* <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-24">
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
                        </section> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;