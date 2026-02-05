import React, { useEffect, useState, useMemo } from 'react';
import { BLOCK_CATEGORY_MAP } from '../constants/blockCategories';
import {
    User, Award, FileText, Calendar, Activity, Briefcase, Settings,
    LogOut, Lock, ChevronRight, CheckCircle2, XCircle, Plus, X,
    Trash2, Edit2, Pencil
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
    getUserProfile, getUserStreak, getFollowers, getFollowees,
    UserProfile, UserStreak, getUserRecords, getUserAwards, getUserCertifications,
    followUser, unfollowUser, updateUserProfile,
    createUserRecord, updateUserRecord, deleteUserRecord,
    createUserAward, updateUserAward, deleteUserAward,
    createUserCertification, updateUserCertification, deleteUserCertification
} from '../api/user';
import { useNavigate, useParams } from 'react-router-dom';
import BlockCreationModal from '../components/BlockCreationModal';
import Toast from '../components/ui/Toast';
import {
    getBlocks, createBlock, updateBlock, deleteBlock,
    getCoverLetters, updateCoverLetter, deleteCoverLetter, createCoverLetter
} from '../api/coverLetter';
import { getTILList, TILItem } from '../api/community';
import { uploadImage } from '../api/image';

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

    // Cover Letter Detail Modal State
    const [isCoverLetterDetailModalOpen, setIsCoverLetterDetailModalOpen] = useState(false);
    const [selectedCoverLetterDetail, setSelectedCoverLetterDetail] = useState<any | null>(null);

    // TIL Gallery State
    const [tils, setTils] = useState<TILItem[]>([]);
    const [isTilLightboxOpen, setIsTilLightboxOpen] = useState(false);
    const [selectedTilIndex, setSelectedTilIndex] = useState(0);

    // Profile Edit State
    const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
    const [profileEditForm, setProfileEditForm] = useState({ name: '', img: '' });
    const [isImageUploading, setIsImageUploading] = useState(false);

    // Toast State
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'info' | 'success' | 'warning' | 'error' });
    const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
        setToast({ visible: true, message, type });
    };
    const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

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

    // Cover Letter Creation States
    const [isCreateSelectionModalOpen, setIsCreateSelectionModalOpen] = useState(false);
    const [isManualCreateModalOpen, setIsManualCreateModalOpen] = useState(false);
    const [manualCoverLetterForm, setManualCoverLetterForm] = useState({
        title: '',
        essays: [{ question: '', content: '', charMax: 500 }]
    });

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
            const blocksArray = Array.isArray(res.blocks) ? res.blocks : (Array.isArray(res.data) ? res.data : (res.data?.blocks || []));
            const normalizedBlocks = blocksArray.map((b: any) => ({
                ...b,
                id: b.id || b.blockId
            }));
            setBlocks(normalizedBlocks);
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
                    coverLettersData,
                    tilsData
                ] = await Promise.all([
                    getUserProfile(targetUserId).catch((err: any) => { console.error(err); return null; }),
                    getUserStreak(targetUserId).then((res: any) => Array.isArray(res) ? res : (res?.data || [])).catch(() => []),
                    getUserRecords(targetUserId).catch(() => []),
                    getUserAwards(targetUserId).catch(() => []),
                    getUserCertifications(targetUserId).catch(() => []),
                    getBlocks(0, 100).catch(() => []),
                    getCoverLetters().catch(() => []),
                    getTILList({ authorId: targetUserId }).catch(() => ({ data: [] }))
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
                        if (!res) return [];
                        // Check for common nested array properties
                        if (Array.isArray(res.data)) return res.data;
                        if (Array.isArray(res.blocks)) return res.blocks;
                        if (Array.isArray(res.items)) return res.items;
                        // Handle cases where the argument is the raw response object
                        if (res.data && Array.isArray(res.data.blocks)) return res.data.blocks;
                        if (res.data && Array.isArray(res.data.items)) return res.data.items;
                        return [];
                    };
                    const extractedBlocks = extractArray(blocksData);
                    const normalizedBlocks = extractedBlocks.map((b: any) => ({
                        ...b,
                        id: b.id || b.blockId
                    }));
                    setBlocks(normalizedBlocks);
                    setCoverLetters(extractArray(coverLettersData));
                }

                // Extract TILs from API response
                // Backend returns: { data: { items: TILItem[], pageInfo: {...} } }
                let extractedTils: TILItem[] = [];
                if (tilsData && typeof tilsData === 'object') {
                    const responseData = tilsData as any;
                    if (Array.isArray(responseData)) {
                        extractedTils = responseData;
                    } else if (responseData.data?.items) {
                        extractedTils = responseData.data.items;
                    } else if (responseData.items) {
                        extractedTils = responseData.items;
                    } else if (responseData.data && Array.isArray(responseData.data)) {
                        extractedTils = responseData.data;
                    }
                }
                // Filter TILs to only show current user's posts
                const filteredTils = extractedTils.filter((til: TILItem) => til.author.accountId === targetUserId);
                setTils(filteredTils);

            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [targetUserId, isOwnProfile, user]);

    // --- Profile Edit Logic ---
    const handleOpenProfileEdit = () => {
        if (!profile) return;
        setProfileEditForm({
            name: profile.name || profile.nickname || '',
            img: (profile.img && profile.img.trim()) || (profile.profileImage && profile.profileImage.trim()) || ''
        });
        setIsProfileEditModalOpen(true);
    };

    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImageUploading(true);
        try {
            const res = await uploadImage(file);
            // res is response.data, which is { data: UploadImageResult }
            // Extract the string URL correctly.
            const imageUrl = typeof res === 'string'
                ? res
                : (res?.data?.primaryUrl || res?.data || res?.url || '');

            if (imageUrl && typeof imageUrl === 'string') {
                setProfileEditForm(prev => ({ ...prev, img: imageUrl }));
            } else {
                console.error("Invalid image URL format received", res);
                showToast("이미지 업로드 결과가 올바르지 않습니다.", "error");
            }
        } catch (error) {
            console.error("Image upload failed", error);
            showToast("이미지 업로드에 실패했습니다.", "error");
        }
    };

    const handleProfileEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.accountId) return;

        try {
            // Validate name length (Backend VO limit: 2 ~ 10 chars)
            if (profileEditForm.name.length < 2) {
                showToast("이름은 2글자 이상이어야 합니다.", "warning");
                return;
            }
            if (profileEditForm.name.length > 10) {
                showToast("이름은 10글자 이하로 입력해주세요.", "warning");
                return;
            }

            const payload = {
                name: (profileEditForm.name || '').trim(),
                img: String(profileEditForm.img || '').trim(),
                email: (profile?.email || user.email || '').trim() // Mandatory fields
            };

            if (!payload.email) {
                console.error("Missing email for profile update");
                showToast("사용자 정보를 확인할 수 없습니다. 다시 로그인해주세요.", "error");
                return;
            }

            await updateUserProfile(user.accountId, payload);

            // Update local state
            setProfile(prev => prev ? {
                ...prev,
                name: profileEditForm.name,
                img: profileEditForm.img
            } : null);

            setIsProfileEditModalOpen(false);
            showToast("프로필이 수정되었습니다.", "success");
        } catch (error) {
            console.error("Profile update failed", error);
            showToast("프로필 수정에 실패했습니다.", "error");
        }
    };

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
                showToast('작업에 실패했습니다.', 'error');
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
            showToast('팔로우/언팔로우 중 오류가 발생했습니다.', 'error');
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

    const handleSaveBlock = async (blockData: { title: string; content: string; categories: number[] }) => {
        try {
            const payload = {
                title: blockData.title,
                content: blockData.content,
                categories: blockData.categories
            };

            if (editingBlock) {
                if (!editingBlock.id) {
                    showToast("Error: Block ID is missing. Cannot update the block.", "error");
                    return;
                }
                await updateBlock(editingBlock.id, payload);
            } else {
                await createBlock(payload);
            }
            await fetchBlocksData();
            setIsBlockModalOpen(false);
            setEditingBlock(null);
        } catch (error) {
            console.error("Failed to save block", error);
            showToast("블록 저장에 실패했습니다.", "error");
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

    const handleUpdateCoverLetterStatus = async (id: number, updates: { isPassed?: boolean | null; isComplete?: boolean }) => {
        if (!selectedCoverLetterDetail) return;

        try {
            // 자소서 업데이트 API는 전체 필드(제목, 완료여부, 합격여부, 질문별 내용)를 요구하므로 
            // 현재 상세 데이터와 변경사항을 병합하여 보냅니다.
            const essays = (selectedCoverLetterDetail.essayList || []).map((essay: any) => {
                const currentVersion = essay.versions?.find((v: any) => v.isCurrent) || essay.versions?.[0];
                return {
                    id: currentVersion?.id,
                    content: currentVersion?.content || ""
                };
            }).filter((e: any) => e.id != null);

            const payload = {
                title: selectedCoverLetterDetail.title,
                isComplete: updates.isComplete !== undefined ? updates.isComplete : (selectedCoverLetterDetail.isComplete ?? false),
                isPassed: updates.isPassed !== undefined ? updates.isPassed : selectedCoverLetterDetail.isPassed,
                essays: essays
            };

            await updateCoverLetter(id, payload);

            // 리스트 상태 업데이트
            setCoverLetters((prev: any[]) => prev.map(cl => cl.id === id ? { ...cl, ...updates } : cl));
            // 현재 열린 상세 모달 상태 업데이트
            if (selectedCoverLetterDetail?.id === id) {
                setSelectedCoverLetterDetail((prev: any) => prev ? { ...prev, ...updates } : null);
            }
        } catch (error) {
            console.error("Failed to update cover letter status", error);
            showToast("상태 수정에 실패했습니다.", "error");
        }
    };

    // --- Manual Cover Letter Handlers ---
    const handleOpenManualCreateModal = () => {
        setManualCoverLetterForm({
            title: '',
            essays: [{ question: '', content: '', charMax: 500 }]
        });
        setIsManualCreateModalOpen(true);
        setIsCreateSelectionModalOpen(false);
    };

    const handleAddManualEssay = () => {
        setManualCoverLetterForm(prev => ({
            ...prev,
            essays: [...prev.essays, { question: '', content: '', charMax: 500 }]
        }));
    };

    const handleRemoveManualEssay = (index: number) => {
        setManualCoverLetterForm(prev => ({
            ...prev,
            essays: prev.essays.filter((_, i) => i !== index)
        }));
    };

    const handleManualEssayChange = (index: number, field: string, value: any) => {
        setManualCoverLetterForm(prev => {
            const newEssays = [...prev.essays];
            newEssays[index] = { ...newEssays[index], [field]: value };
            return { ...prev, essays: newEssays };
        });
    };

    const handleSaveManualCoverLetter = async () => {
        if (!manualCoverLetterForm.title.trim()) {
            showToast("자소서 제목을 입력해주세요.", "warning");
            return;
        }
        try {
            await createCoverLetter(manualCoverLetterForm);
            const res: any = await getCoverLetters();
            setCoverLetters(res.data || []);
            setIsManualCreateModalOpen(false);
        } catch (error) {
            console.error("Failed to create manual cover letter", error);
            showToast("자소서 생성에 실패했습니다.", "error");
        }
    };

    // --- Cover Letter Detail Handler ---
    const handleOpenCoverLetterDetail = async (coverLetterId: number) => {
        try {
            const { getCoverLetterDetail } = await import('../api/coverLetter');
            const response = await getCoverLetterDetail(coverLetterId);
            setSelectedCoverLetterDetail(response.data);
            setIsCoverLetterDetailModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch cover letter detail", error);
            showToast("자소서 상세 정보를 불러오는데 실패했습니다.", "error");
        }
    };

    // --- TIL Gallery Handlers ---
    const handleOpenTilLightbox = (index: number) => {
        setSelectedTilIndex(index);
        setIsTilLightboxOpen(true);
    };

    const handleCloseTilLightbox = () => {
        setIsTilLightboxOpen(false);
    };

    const handleNextTil = () => {
        setSelectedTilIndex((prev) => (prev + 1) % tils.length);
    };

    const handlePrevTil = () => {
        setSelectedTilIndex((prev) => (prev - 1 + tils.length) % tils.length);
    };

    const generateGradient = (index: number) => {
        const gradients = [
            'from-pink-200 to-purple-200',
            'from-blue-200 to-cyan-200',
            'from-green-200 to-teal-200',
            'from-orange-200 to-red-200',
            'from-indigo-200 to-blue-200',
            'from-yellow-200 to-orange-200',
            'from-teal-200 to-green-200',
            'from-purple-200 to-pink-200'
        ];
        return `bg-gradient-to-br ${gradients[index % gradients.length]}`;
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
        } catch (error) { console.error(error); showToast('저장 실패', 'error'); }
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
        } catch (error) { console.error(error); showToast('저장 실패', 'error'); }
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
        } catch (error) { console.error(error); showToast('저장 실패', 'error'); }
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
                                            <img
                                                src={(followUser.profileImage && followUser.profileImage.trim() && followUser.profileImage !== 'default_img.png') ? followUser.profileImage : '/default-profile.jpg'}
                                                alt={followUser.nickname}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { (e.target as HTMLImageElement).src = '/default-profile.jpg'; }}
                                            />
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

            {/* --- Cover Letter Detail Modal --- */}
            {isCoverLetterDetailModalOpen && selectedCoverLetterDetail && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-start rounded-t-2xl">
                            <div>
                                <h3 className="font-bold text-2xl text-slate-800">{selectedCoverLetterDetail.companyName} 자소서</h3>
                                <p className="text-sm text-slate-500 mt-1">{selectedCoverLetterDetail.title}</p>
                                <div className="flex gap-2 mt-2">
                                    {selectedCoverLetterDetail.isPassed === true && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">합격</span>}
                                    {selectedCoverLetterDetail.isPassed === false && <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-md">불합격</span>}
                                    {selectedCoverLetterDetail.isComplete === false && <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">작성중</span>}
                                    {selectedCoverLetterDetail.isComplete === true && <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-md">작성완료</span>}
                                </div>
                            </div>
                            <button onClick={() => setIsCoverLetterDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {selectedCoverLetterDetail.essayList && selectedCoverLetterDetail.essayList.length > 0 ? (
                                selectedCoverLetterDetail.essayList.map((essay: any, idx: number) => (
                                    <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 hover:bg-white transition-colors">
                                        {/* Question */}
                                        <div className="mb-4">
                                            <div className="flex items-start gap-3 mb-2">
                                                <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                    {idx + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-800 text-base leading-relaxed">{essay.question}</h4>
                                                    <p className="text-xs text-slate-400 mt-1">최대 {essay.charMax}자</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Answers/Versions */}
                                        {essay.versions && essay.versions.length > 0 ? (
                                            <div className="space-y-3">
                                                {essay.versions.map((version: any) => (
                                                    <div key={version.id} className={`p-4 rounded-lg border ${version.isCurrent ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-200 bg-white'}`}>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs font-bold text-slate-500">{version.title}</span>
                                                            {version.isCurrent && (
                                                                <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full">현재 버전</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{version.content}</p>
                                                        <div className="mt-2 text-xs text-slate-400">
                                                            {version.content.length} / {essay.charMax}자
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-slate-100 rounded-lg text-center">
                                                <p className="text-sm text-slate-400">아직 작성된 답변이 없습니다.</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-slate-400">등록된 질문이 없습니다.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-2xl">
                            <div className="flex flex-wrap items-center gap-4">
                                {/* Result Selection */}
                                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                                    <button
                                        onClick={() => handleUpdateCoverLetterStatus(selectedCoverLetterDetail.id, { isPassed: null })}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${selectedCoverLetterDetail.isPassed === null ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        대기중
                                    </button>
                                    <button
                                        onClick={() => handleUpdateCoverLetterStatus(selectedCoverLetterDetail.id, { isPassed: true })}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${selectedCoverLetterDetail.isPassed === true ? 'bg-green-500 text-white shadow-sm' : 'text-slate-400 hover:text-green-600'}`}
                                    >
                                        합격
                                    </button>
                                    <button
                                        onClick={() => handleUpdateCoverLetterStatus(selectedCoverLetterDetail.id, { isPassed: false })}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${selectedCoverLetterDetail.isPassed === false ? 'bg-red-500 text-white shadow-sm' : 'text-slate-400 hover:text-red-600'}`}
                                    >
                                        불합격
                                    </button>
                                </div>

                                {/* Completion Selection */}
                                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                                    <button
                                        onClick={() => handleUpdateCoverLetterStatus(selectedCoverLetterDetail.id, { isComplete: false })}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${selectedCoverLetterDetail.isComplete === false ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        작성중
                                    </button>
                                    <button
                                        onClick={() => handleUpdateCoverLetterStatus(selectedCoverLetterDetail.id, { isComplete: true })}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${selectedCoverLetterDetail.isComplete === true ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-blue-600'}`}
                                    >
                                        작성완료
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsCoverLetterDetailModalOpen(false)}
                                    className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-colors"
                                >
                                    닫기
                                </button>
                                <button
                                    onClick={() => {
                                        setIsCoverLetterDetailModalOpen(false);
                                        navigate(`/generate?coverLetterId=${selectedCoverLetterDetail.id}&recruitmentId=${selectedCoverLetterDetail.recruitmentId}`);
                                    }}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                >
                                    작성 페이지로 이동
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TIL Lightbox Modal --- */}
            {isTilLightboxOpen && tils.length > 0 && selectedTilIndex < tils.length && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
                    onClick={handleCloseTilLightbox}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') handleCloseTilLightbox();
                        if (e.key === 'ArrowLeft') handlePrevTil();
                        if (e.key === 'ArrowRight') handleNextTil();
                    }}
                >
                    <div
                        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Today I Learned</h2>
                                    <p className="text-xs text-slate-500">
                                        {selectedTilIndex + 1} / {tils.length}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseTilLightbox}
                                className="p-2 hover:bg-white/50 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-600" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Visual Header */}
                            <div className={`w-full aspect-[16/9] rounded-xl ${generateGradient(selectedTilIndex)} flex items-center justify-center p-8`}>
                                <h1 className="text-3xl font-bold text-slate-700 text-center drop-shadow-md">
                                    {tils[selectedTilIndex].title}
                                </h1>
                            </div>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    {tils[selectedTilIndex].author.name}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(tils[selectedTilIndex].createdAt || Date.now()).toLocaleDateString('ko-KR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Activity className="w-4 h-4" />
                                    {tils[selectedTilIndex].view || 0} views
                                </span>
                            </div>

                            {/* Tags */}
                            {tils[selectedTilIndex].tags && tils[selectedTilIndex].tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tils[selectedTilIndex].tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1.5 bg-purple-100 text-purple-700 text-sm font-medium rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Content */}
                            <div className="prose prose-slate max-w-none">
                                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {tils[selectedTilIndex].content}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer with Navigation */}
                        <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50">
                            <button
                                onClick={(e) => { e.stopPropagation(); handlePrevTil(); }}
                                disabled={tils.length <= 1}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" />
                                이전
                            </button>
                            <span className="text-sm text-slate-500 font-medium">
                                {selectedTilIndex + 1} of {tils.length}
                            </span>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleNextTil(); }}
                                disabled={tils.length <= 1}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                다음
                                <ChevronRight className="w-4 h-4" />
                            </button>
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
                                <img
                                    src={(profile?.img && profile.img.trim()) || (profile?.profileImage && profile.profileImage.trim()) || '/default-profile.jpg'}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/default-profile.jpg'; }}
                                />
                            </div>
                            {isOwnProfile && (
                                <button
                                    onClick={handleOpenProfileEdit}
                                    className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-indigo-600 shadow-sm transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                </button>
                            )}
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

                        {/* 2. TIL Visual Gallery */}
                        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-500" />
                                    <span>Today I Learned</span>
                                </h2>
                                {tils.length > 0 && (
                                    <span className="text-sm text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-full">
                                        {tils.length}개의 기록
                                    </span>
                                )}
                            </div>

                            {tils.length > 0 ? (
                                <div className="columns-2 md:columns-3 gap-5">
                                    {tils.map((til, index) => (
                                        <div
                                            key={til.tilId}
                                            onClick={() => handleOpenTilLightbox(index)}
                                            className="break-inside-avoid mb-5 cursor-pointer group inline-block w-full"
                                        >
                                            <div className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-slate-200">
                                                {/* Thumbnail or Gradient */}
                                                <div className={`relative aspect-[4/3] ${generateGradient(index)} flex items-center justify-center p-6`}>
                                                    <h3 className="text-lg font-bold text-slate-700 text-center line-clamp-3 drop-shadow-sm">
                                                        {til.title}
                                                    </h3>
                                                </div>

                                                {/* Card Footer */}
                                                <div className="p-3 bg-white border-t border-slate-100">
                                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <Activity className="w-3 h-3" />
                                                            {til.view || 0} views
                                                        </span>
                                                        <span>{new Date(til.createdAt || Date.now()).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
                                                    </div>
                                                    {til.tags && til.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-2">
                                                            {til.tags.slice(0, 3).map((tag, idx) => (
                                                                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    <p>아직 TIL이 하나도 작성되지 않았습니다.</p>
                                </div>
                            )}
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
                                                    <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => handleOpenCoverLetterDetail(item.id)}>
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
                                                        {item.isPassed === true ? (
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-md">합격</span>
                                                        ) : item.isPassed === false ? (
                                                            <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded-md">불합격</span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md">대기중</span>
                                                        )}

                                                        {item.isComplete === true ? (
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-md">완료</span>
                                                        ) : (
                                                            <span className="px-2 py-1 bg-slate-100 text-slate-400 text-[10px] font-bold rounded-md whitespace-nowrap">작성중</span>
                                                        )}


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
                                            <button
                                                onClick={() => setIsCreateSelectionModalOpen(true)}
                                                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-medium hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
                                            >
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
                                                        <div className="flex flex-wrap gap-1 mt-auto">
                                                            {(block.categories || []).map((code: number) => (
                                                                <span key={code} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md border border-indigo-100">
                                                                    #{(BLOCK_CATEGORY_MAP as Record<number, string>)[code] || '기타'}
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
            </div >

            {/* --- Cover Letter Creation Selection Modal --- */}
            {isCreateSelectionModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transform animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">새 자소서 작성하기</h3>
                            <button onClick={() => setIsCreateSelectionModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    setIsCreateSelectionModalOpen(false);
                                    navigate('/recruitments');
                                }}
                                className="w-full p-6 border-2 border-slate-100 rounded-2xl flex items-center gap-4 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all text-left group"
                            >
                                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">채용 공고에서 찾기</h4>
                                    <p className="text-sm text-slate-500">원하는 기업의 공고를 선택하고 자소서를 생성합니다.</p>
                                </div>
                            </button>
                            <button
                                onClick={handleOpenManualCreateModal}
                                className="w-full p-6 border-2 border-slate-100 rounded-2xl flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left group"
                            >
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Edit2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">직접 작성하기</h4>
                                    <p className="text-sm text-slate-500">공고 없이 자유롭게 문항을 구성하여 작성합니다.</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Manual Cover Letter Create Modal --- */}
            {isManualCreateModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">자소서 직접 작성</h3>
                                <p className="text-sm text-slate-500">지원하고 싶은 기업의 정보를 입력하고 내용을 구성하세요.</p>
                            </div>
                            <button onClick={() => setIsManualCreateModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">자소서 제목</label>
                                <input
                                    type="text"
                                    value={manualCoverLetterForm.title}
                                    onChange={(e) => setManualCoverLetterForm(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="예: 2024 상반기 삼성전자 웹개발자 지원"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                />
                            </div>

                            {/* Essays */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-slate-700">자기소개서 문항</label>
                                    <button
                                        onClick={handleAddManualEssay}
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" /> 문항 추가
                                    </button>
                                </div>

                                {manualCoverLetterForm.essays.map((essay, idx) => (
                                    <div key={idx} className="p-6 border border-slate-100 rounded-2xl bg-slate-50/50 relative group">
                                        <button
                                            onClick={() => handleRemoveManualEssay(idx)}
                                            className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-slate-200 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                                            disabled={manualCoverLetterForm.essays.length === 1}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        <div className="space-y-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    value={essay.question}
                                                    onChange={(e) => handleManualEssayChange(idx, 'question', e.target.value)}
                                                    placeholder={`질문을 입력하세요 (예: ${idx + 1}. 지원 동기 및 비전)`}
                                                    className="w-full px-0 py-2 bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                                                />
                                            </div>
                                            <div>
                                                <textarea
                                                    value={essay.content}
                                                    onChange={(e) => handleManualEssayChange(idx, 'content', e.target.value)}
                                                    placeholder="내용을 입력하세요..."
                                                    className="w-full min-h-[150px] p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-colors"
                                                />
                                            </div>
                                            <div className="flex justify-end items-center gap-3">
                                                <span className="text-[10px] font-bold text-slate-400">최대 글자수</span>
                                                <input
                                                    type="number"
                                                    value={essay.charMax}
                                                    onChange={(e) => handleManualEssayChange(idx, 'charMax', parseInt(e.target.value) || 0)}
                                                    className="w-20 px-2 py-1 text-xs border border-slate-200 rounded text-center outline-none focus:ring-1 focus:ring-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => setIsManualCreateModalOpen(false)}
                                className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSaveManualCoverLetter}
                                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Profile Edit Modal --- */}
            {isProfileEditModalOpen && (
                <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transform animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">프로필 설정</h3>
                                <p className="text-sm text-slate-500">나의 정보를 업데이트하세요.</p>
                            </div>
                            <button onClick={() => setIsProfileEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleProfileEditSubmit} className="space-y-8">
                            {/* Profile Image */}
                            <div className="flex flex-col items-center">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-md bg-slate-100">
                                        <img
                                            src={profileEditForm.img || '/default-profile.jpg'}
                                            alt="Profile Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = '/default-profile.jpg'; }}
                                        />
                                        {isImageUploading && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 cursor-pointer transition-all hover:scale-110 active:scale-95">
                                        <Plus className="w-4 h-4" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleProfileImageChange}
                                            disabled={isImageUploading}
                                        />
                                    </label>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-wider text-center">프로필 이미지 변경</p>
                            </div>

                            {/* Name Input */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">이름</label>
                                <input
                                    type="text"
                                    value={profileEditForm.name}
                                    onChange={(e) => setProfileEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    placeholder="이름을 입력하세요"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 shadow-inner"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsProfileEditModalOpen(false)}
                                    className="flex-1 py-4 text-slate-400 font-bold hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    disabled={isImageUploading}
                                    className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:opacity-50"
                                >
                                    저장하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast.visible && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.visible}
                    onClose={closeToast}
                />
            )}
        </div >
    );
};

export default MyPage;