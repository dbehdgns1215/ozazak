import React, { useEffect, useState, useMemo } from 'react';
import { BLOCK_CATEGORY_MAP } from '../constants/blockCategories';
import {
    User, Award, FileText, Calendar, Activity, Briefcase, Settings,
    LogOut, Lock, ChevronRight, CheckCircle2, XCircle, Plus, X,
    Trash2, Edit2, Pencil, MoreVertical, Sparkles, BookOpen, FolderGit2,
    Bookmark, ChevronLeft
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import {
    getUserProfile, getUserStreak, getFollowers, getFollowees,
    UserProfile, UserStreak, getUserRecords, getUserAwards, getUserCertifications,
    followUser, unfollowUser, updateUserProfile,
    createUserRecord, updateUserRecord, deleteUserRecord,
    createUserAward, updateUserAward, deleteUserAward,
    createUserCertification, updateUserCertification, deleteUserCertification,
    generateBlockFromTIL
} from '../api/user';
import { useNavigate, useParams } from 'react-router-dom';
import MarkdownPreview from '../components/editor/MarkdownPreview';
import BlockCreationModal from '../components/BlockCreationModal';
import CustomAlert from '../components/CustomAlert';
import Toast from '../components/ui/Toast';
import {
    getBlocks, createBlock, updateBlock, deleteBlock,
    getCoverLetters, updateCoverLetter, deleteCoverLetter, createCoverLetter
} from '../api/coverLetter';
import { getTILList, TILItem, deleteTIL } from '../api/community';
import { uploadImage } from '../api/image';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { getBookmarkedRecruitments } from '../api/recruitment';
import { SafeImageProcessor } from '../utils/SafeImageProcessor';

type TabType = 'RESUME' | 'BLOCKS';


type FollowType = 'FOLLOWER' | 'FOLLOWING';

// --- Source Type Constants ---
const SOURCE_TYPE_ICONS: Record<string, any> = {
    'COVER_LETTER': FileText,
    'TIL': BookOpen,
    'PROJECT': FolderGit2
};

const SOURCE_TYPE_LABELS: Record<string, string> = {
    'COVER_LETTER': '자소서',
    'TIL': 'TIL',
    'PROJECT': '프로젝트'
};

const getSourceText = (sourceType: string, sourceTitle: string): string => {
    const label = SOURCE_TYPE_LABELS[sourceType] || '소스';
    const truncatedTitle = sourceTitle.length > 15
        ? sourceTitle.substring(0, 15) + '...'
        : sourceTitle;
    return `${label} "${truncatedTitle}"에서 생성됨`;
};

// --- Streak Graph Component ---
interface StreakGraphProps {
    streakData: UserStreak[];
    selectedYear: number;
    onYearChange: (year: number) => void;
}

const StreakGraph = ({ streakData, selectedYear, onYearChange }: StreakGraphProps) => {
    const today = new Date();
    const currentYear = today.getFullYear();

    const streakMap = useMemo(() => {
        const safeData = Array.isArray(streakData) ? streakData : [];
        return new Map(safeData.map(s => [s.date, s.value]));
    }, [streakData]);

    const availableYears = useMemo(() => {
        const years = new Set<number>();
        years.add(currentYear);
        years.add(currentYear - 1); // Ensure previous year is shown
        return Array.from(years).sort((a, b) => b - a);
    }, [currentYear]);

    const getLevel = (count: number) => {
        if (!count || count === 0) return 0;
        if (count <= 3) return 1; // 1~3
        if (count <= 5) return 2; // 4~5
        if (count <= 8) return 3; // 6~8
        return 4; // 9+
    };

    const colorStyles = [
        { backgroundColor: '#f1f5f9' }, // Level 0: Empty
        { backgroundColor: '#cefcf4' }, // Level 1 (1~3)
        { backgroundColor: '#75e7d8' }, // Level 2 (4~5)
        { backgroundColor: '#33c2a6' }, // Level 3 (6~8)
        { backgroundColor: '#009a87' }, // Level 4 (9+)
    ];

    const { paddedDays, monthLabels } = useMemo(() => {
        let days: { date: string; value: number; isFirstOfMonth?: boolean; monthName?: string }[] = [];

        // Always standard 365 days for the selected year (Jan 1st to Dec 31st)
        const startDate = new Date(selectedYear, 0, 1);
        const endDate = new Date(selectedYear, 11, 31);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            // Fix: Use local time YYYY-MM-DD to avoid UTC shift
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const dayNum = String(d.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${dayNum}`;

            const isFirst = d.getDate() === 1;

            days.push({
                date: dateStr,
                value: streakMap.get(dateStr) || 0,
                isFirstOfMonth: isFirst,
                monthName: isFirst ? d.toLocaleDateString('ko-KR', { month: 'short' }) : undefined
            });
        }

        const firstDayOfWeek = new Date(days[0].date).getDay();
        const padded = [...Array(firstDayOfWeek).fill(null), ...days];

        // Month label mapping based on columns
        const labels: { name: string; colIndex: number }[] = [];
        padded.forEach((day, index) => {
            if (day && day.isFirstOfMonth) {
                const colIndex = Math.floor(index / 7);
                // Prevent overlapping labels
                if (labels.length === 0 || colIndex - labels[labels.length - 1].colIndex > 2) {
                    labels.push({ name: day.monthName || '', colIndex });
                }
            }
        });

        return { paddedDays: padded, monthLabels: labels };
    }, [selectedYear, streakMap]);

    const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="space-y-10">
            <div className="flex justify-end">
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(parseInt(e.target.value))}
                    className="text-xs font-bold text-slate-500 bg-slate-50 border-none rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                    {availableYears.map(year => (
                        <option key={year} value={year}>{year}년</option>
                    ))}
                </select>
            </div>

            {/* Changed: Hidden scrollbar using custom style as utility might not verify across browsers */}
            {/* Changed: Hidden scrollbar using custom style as utility might not verify across browsers */}
            {/* Added pt-2 for top safety */}
            <div
                className="relative flex gap-1 overflow-x-auto pb-4 pt-2 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* Day Labels Column */}
                <div className="flex flex-col gap-[3px] mr-2 select-none">
                    {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                        <span key={i} className="text-[9px] h-[11px] flex items-center justify-end text-slate-400 font-bold">{d}</span>
                    ))}
                </div>

                {/* Streak Grid - 365 days */}
                <div className="flex gap-[3px] min-w-max">
                    <div className="inline-block relative">
                        <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
                            {paddedDays.map((day, index) => {
                                if (!day) return <div key={`pad-${index}`} className="w-[11px] h-[11px]" />;
                                const level = getLevel(day.value);
                                const rowIndex = index % 7;
                                const isTopRow = rowIndex <= 1; // Show tooltip below for first 2 rows

                                return (
                                    <div key={day.date} className="group relative z-0 hover:z-50">
                                        <div
                                            style={colorStyles[level]}
                                            className="w-[11px] h-[11px] rounded-[1px] transition-colors hover:ring-2 hover:ring-indigo-400 cursor-default"
                                        />

                                        {/* Tooltip */}
                                        <div className={`absolute left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-slate-800 text-white text-[10px] rounded py-1 px-2 whitespace-nowrap shadow-xl z-50 pointer-events-none ${isTopRow ? 'top-full mt-1.5' : 'bottom-full mb-1.5'}`}>
                                            {!isTopRow && (
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                            )}
                                            {isTopRow && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-800"></div>
                                            )}

                                            <span className="font-bold mb-0.5">{day.date}</span>
                                            <span>{day.value}회 활동</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Month Labels - Precisely aligned to columns (Box 11px + Gap 3px = 14px) */}
                        <div className="relative h-6 mt-3">
                            {monthLabels.map((label, i) => (
                                <div
                                    key={i}
                                    className="absolute"
                                    style={{ left: `${label.colIndex * 14}px` }}
                                >
                                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{label.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1.5 mt-2">
                {[0, 1, 2, 3, 4].map(level => (
                    <div key={level} className="flex items-center gap-1">
                        <span className="text-[8px] font-bold text-slate-300">{level}</span>
                        <div style={colorStyles[level]} className="w-[11px] h-[11px] rounded-[2px]" />
                    </div>
                ))}
            </div>
        </div>
    );
};


const MyPage = () => {
    const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD" 형식
    const navigate = useNavigate();
    const { userId: paramUserId } = useParams(); // Get user ID from URL
    const { user, isAuthenticated, updateUserState } = useAuth();

    // Determine which user's data to show
    const targetUserId = useMemo(() => {
        if (paramUserId) return parseInt(paramUserId);
        return user?.accountId;
    }, [paramUserId, user]);

    const isOwnProfile = !paramUserId || (user?.accountId && parseInt(paramUserId) === user.accountId);

    // --- State ---
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const [streak, setStreak] = useState<UserStreak[]>([]);
    const [streakStats, setStreakStats] = useState({ currentStreak: 0, longestStreak: 0 }); // Added streak stats state
    const [records, setRecords] = useState<any[]>([]);
    const [awards, setAwards] = useState<any[]>([]);
    const [certifications, setCertifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [resumeTab, setResumeTab] = useState<TabType>('RESUME');

    // Custom Alert State
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info' as 'info' | 'success' | 'warning' | 'error',
        onConfirm: undefined as (() => void) | undefined | null
    });

    const openAlert = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', onConfirm?: (() => void) | null) => {
        setAlertState({ isOpen: true, title, message, type, onConfirm });
    };

    // Alias for backward compatibility
    const showAlert = openAlert;

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

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

    // --- Pagination State ---
    const [recordPage, setRecordPage] = useState(1);
    const [awardPage, setAwardPage] = useState(1);
    const [certPage, setCertPage] = useState(1);
    const [recruitPage, setRecruitPage] = useState(1);
    const ITEMS_PER_PAGE = 4;
    const RECRUIT_ITEMS_PER_PAGE = 5;

    // Bookmarked Recruitments State
    const [bookmarkedRecruitments, setBookmarkedRecruitments] = useState<any[]>([]);

    // TIL Gallery State
    const [tils, setTils] = useState<TILItem[]>([]);
    const [isTilLightboxOpen, setIsTilLightboxOpen] = useState(false);
    const [selectedTilIndex, setSelectedTilIndex] = useState(0);
    const [tilMenuOpen, setTilMenuOpen] = useState<number | null>(null);
    const [isImportingTil, setIsImportingTil] = useState(false);

    // Profile Edit State

    const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);
    const [profileEditForm, setProfileEditForm] = useState({ name: '', img: '' });
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Global submission lock

    // --- Streak Year State ---
    const [selectedStreakYear, setSelectedStreakYear] = useState<number>(new Date().getFullYear());

    // Toast State
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'info' | 'success' | 'warning' | 'error' });
    const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
        setToast({ visible: true, message, type });
        // Auto-dismiss is now handled by the Toast component itself
    };
    const closeToast = () => setToast(prev => ({ ...prev, visible: false }));

    // --- Custom Alert State ---


    // --- CRUD States ---
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
    const [recordForm, setRecordForm] = useState({ title: '', description: '', startDate: '', endDate: '', organization: '' });
    const [editingRecordId, setEditingRecordId] = useState<number | null>(null);

    const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
    const [awardForm, setAwardForm] = useState({ title: '', awardedAt: '', organization: '', rankName: '' });
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



    // Use API provided stats if available, otherwise 0 (or fallback to calculation if needed, but user requested API data)
    const currentStreak = streakStats.currentStreak;
    const maxStreak = streakStats.longestStreak;

    // --- Helper Functions ---
    const parseErrorMessage = (error: any): string => {
        // Axios error response
        if (error.response?.data?.message) {
            const backendMessage = error.response.data.message;

            // 필드별 에러 메시지 매핑
            const fieldErrors: Record<string, string> = {
                'question: 질문은 필수입니다': '질문을 입력해주세요',
                'question은 필수입니다': '질문을 입력해주세요',
                'content: 내용은 필수입니다': '내용을 입력해주세요',
                'content은 필수입니다': '내용을 입력해주세요',
                'title: 제목은 필수입니다': '제목을 입력해주세요',
                'title은 필수입니다': '제목을 입력해주세요',
                'essays[0].question': '첫 번째 항목의 질문을 입력해주세요',
                'essays[0].content': '첫 번째 항목의 내용을 입력해주세요',
            };

            // 키워드 매칭으로 사용자 친화적 메시지 반환
            for (const [keyword, friendlyMsg] of Object.entries(fieldErrors)) {
                if (backendMessage.includes(keyword)) {
                    return friendlyMsg;
                }
            }

            // 백엔드 메시지를 그대로 반환
            return backendMessage;
        }

        return "자소서 생성에 실패했습니다.";
    };

    const refreshBlocks = async (source: string) => {
        try {
            console.log(`[DEBUG] refreshBlocks (from ${source}): Starting fetch...`);
            const res: any = await getBlocks(0, 100);
            console.log(`[DEBUG] refreshBlocks (from ${source}): Raw response:`, res);

            let extracted: any[] = [];
            if (Array.isArray(res)) extracted = res;
            else if (Array.isArray(res.data)) extracted = res.data;
            else if (Array.isArray(res.blocks)) extracted = res.blocks;
            else if (res.data && Array.isArray(res.data.blocks)) extracted = res.data.blocks;
            else if (res.data && Array.isArray(res.data.items)) extracted = res.data.items;

            const normalized = extracted.map((b: any) => ({
                ...b,
                id: b.id || b.blockId
            }));

            console.log(`[DEBUG] refreshBlocks (from ${source}): Setting blocks count:`, normalized.length);
            if (normalized.length === 0) console.trace(`[DEBUG] refreshBlocks: Setting blocks to EMPTY from ${source}`);

            setBlocks(normalized);
            return normalized;
        } catch (error) {
            console.error(`[DEBUG] refreshBlocks (from ${source}): Failed`, error);
            return [];
        }
    };

    // Fetch Bookmarked Recruitments (Only for own profile)
    useEffect(() => {
        const fetchBookmarks = async () => {
            if (isOwnProfile && user?.accountId) {
                try {
                    const res = await getBookmarkedRecruitments({ size: 100 });
                    setBookmarkedRecruitments(res.data || []);
                } catch (error) {
                    console.error("Failed to fetch bookmarked recruitments:", error);
                }
            }
        };
        fetchBookmarks();
    }, [isOwnProfile, user?.accountId]);

    const fetchBlocksData = () => refreshBlocks('fetchBlocksData_helper');

    // Page clamping for pagination
    useEffect(() => {
        const checkPage = (items: any[], currentPage: number, setPage: (p: number) => void) => {
            if (items.length > 0) {
                const maxPage = Math.ceil(items.length / ITEMS_PER_PAGE);
                if (currentPage > maxPage) setPage(maxPage || 1);
            } else if (currentPage !== 1) {
                setPage(1);
            }
        };
        checkPage(records, recordPage, setRecordPage);
        checkPage(awards, awardPage, setAwardPage);
        checkPage(certifications, certPage, setCertPage);
        checkPage(bookmarkedRecruitments, recruitPage, setRecruitPage);
    }, [records.length, awards.length, certifications.length, bookmarkedRecruitments.length, recordPage, awardPage, certPage, recruitPage, ITEMS_PER_PAGE]);

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
                    recordsData,
                    awardsData,
                    certificationsData,
                    blocksData,
                    coverLettersData,
                    tilsData
                ] = await Promise.all([
                    getUserProfile(targetUserId).catch((err: any) => { console.error(err); return null; }),
                    getUserRecords(targetUserId).catch(() => []),
                    getUserAwards(targetUserId).catch(() => []),
                    getUserCertifications(targetUserId).catch(() => []),
                    getBlocks(0, 100).catch(() => []),
                    getCoverLetters().catch(() => []),
                    getTILList({ authorId: targetUserId }).catch(() => ({ data: [] }))
                ]);

                setProfile(profileData);
                // 최신순 정렬 (startDate 기준)
                const sortedRecords = (recordsData || []).sort((a: any, b: any) => {
                    const dateA = a.startDate || '';
                    const dateB = b.startDate || '';
                    return dateB.localeCompare(dateA); // 내림차순
                });
                setRecords(sortedRecords);

                // Map awards data from API response
                const rawAwards = awardsData?.data?.awards || awardsData?.awards || awardsData || [];
                const mappedAwards = rawAwards.map((a: any) => ({
                    id: a.awardId || a.id,
                    title: a.title,
                    rankName: a.rankName,
                    organization: a.organization,
                    awardedAt: a.awardedAt,
                }));
                setAwards(mappedAwards);

                setCertifications(certificationsData || []);
                if (isOwnProfile) {
                    await refreshBlocks('useEffect_initial');
                    const extractArray = (res: any) => {
                        if (Array.isArray(res)) return res;
                        if (!res) return [];
                        if (Array.isArray(res.data)) return res.data;
                        if (Array.isArray(res.items)) return res.items;
                        return [];
                    };
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
                // Mapping IDs for consistency with TILItem type (tilId)
                const mappedTils = extractedTils.map((item: any) => ({
                    ...item,
                    tilId: item.communityId || item.tilId || item.id,
                    communityId: item.communityId || item.tilId || item.id // Keep for any internal logic that might use it
                }));

                // Filter TILs to only show current user's posts
                const filteredTils = mappedTils.filter((til: any) => til.author.accountId === targetUserId);
                setTils(filteredTils);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [targetUserId, isOwnProfile, user]);

    // Separate effect for Streak data (Refetch when year changes)
    useEffect(() => {
        if (!targetUserId) return;

        const fetchStreak = async () => {
            try {
                const dateParam: string = `${selectedStreakYear}-01-01`;

                const res = await getUserStreak(targetUserId, dateParam);

                // Extract items and stats
                // Assuming res structure based on user feedback:
                // { ..., streakData: { currentStreak: X, longestStreak: Y }, ... }
                // or if res IS the array it might be missing stats? User said API returns stats.
                // We'll trust that res (or res.data) has streakData.

                const responseData = res?.data || res || {};
                const extractedStreak = Array.isArray(responseData) ? responseData : (responseData.items || responseData.data || []);

                // Set Items
                setStreak(extractedStreak);

                // Set Stats
                if (responseData.streakData) {
                    setStreakStats(responseData.streakData);
                } else if (res.streakData) {
                    setStreakStats(res.streakData);
                }
            } catch (error) {
                console.error("Failed to fetch streak data", error);
                setStreak([]);
            }
        };

        fetchStreak();
    }, [targetUserId, selectedStreakYear]);

    // --- Profile Edit Logic ---
    const handleOpenProfileEdit = () => {
        if (!profile) return;
        setProfileEditForm({
            name: profile.name || profile.nickname || '',
            img: (profile.img && profile.img.trim()) || (profile.profileImage && profile.profileImage.trim()) || ''
        });
        setIsProfileEditModalOpen(true);
    };




    // Helper for character limit input
    const handleInputChangeWithLimit = (
        setter: React.Dispatch<React.SetStateAction<any>>,
        prevData: any,
        field: string,
        value: string,
        limit: number,
        label: string
    ) => {
        // Allow input up to the limit.
        // If the user tries to paste a longer string, trim it to the limit.
        if (value.length > limit) {
            // Option 1: Just cut it off
            value = value.slice(0, limit);
            showToast(`${label}은(는) ${limit}자까지만 입력 가능합니다.`, "warning");
        }
        setter({ ...prevData, [field]: value });
    };

    // Helper for UI truncation
    const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        if (text.length > maxLength) {
            return text.substring(0, maxLength - 3) + '...';
        }
        return text;
    };

    // Helper to process and upload (extracted for callback usage)
    const processAndUploadProfileImage = async (file: File, stats: any) => {
        setIsImageUploading(true);
        try {
            // 3. Process (Resize & Convert to WebP)
            const processedBlob = await SafeImageProcessor.processImage(file, stats);

            // 4. Create File object from Blob
            const processedFile = new File([processedBlob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: "image/webp"
            });

            // 5. Upload
            const res = await uploadImage(processedFile);

            // Extract URL
            const imageUrl = typeof res === 'string'
                ? res
                : (res?.data?.primaryUrl || res?.data || res?.url || '');

            if (imageUrl && typeof imageUrl === 'string') {
                setProfileEditForm(prev => ({ ...prev, img: imageUrl }));
                showToast("이미지가 성공적으로 처리되었습니다.", "success");
            } else {
                console.error("Invalid image URL format received", res);
                showToast("이미지 업로드 결과가 올바르지 않습니다.", "error");
            }
        } catch (error: any) {
            console.error("Profile image upload failed", error);
            showToast(error.message || "이미지 업로드에 실패했습니다.", "error");
        } finally {
            setIsImageUploading(false);
        }
    };

    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // 1. Analyze Image
            showToast("이미지 분석 중...", "info");
            let stats;
            try {
                stats = await SafeImageProcessor.detectImageStats(file);
            } catch (eStats) {
                console.warn('Stats detection warning:', eStats);
                stats = { tier: 'NORMAL', size: file.size, width: 0, height: 0, mp: 0 };
            }

            // 2. Validate
            if (stats.tier === 'REJECT') {
                showToast(`이미지가 너무 큽니다. (~${Math.round(stats.size / 1024 / 1024)}MB)`, "error");
                return;
            }

            if (stats.tier === 'EXTREME') {
                showAlert(
                    "초고해상도 이미지 감지",
                    "용량: ${Math.round(stats.size / 1024 / 1024)}MB\\n해상도: ${stats.width}x${stats.height}\\n\\n브라우저가 느려질 수 있습니다. 계속하시겠습니까?",
                    "warning",
                    async () => {
                        closeAlert();
                        // Continue processing inside callback
                        await processAndUploadProfileImage(file, stats);
                    }
                );
                return;
            }

            if (stats.tier === 'WARNING') {
                showToast("고해상도 이미지 처리 중... 시간이조금 걸릴 수 있습니다.", "info");
            }

            await processAndUploadProfileImage(file, stats);

        } catch (error: any) {
            console.error("Profile image upload failed", error);
            showToast(error.message || "이미지 업로드에 실패했습니다.", "error");
        } finally {
            setIsImageUploading(false);
            // Reset input to allow re-selection of same file
            e.target.value = '';
        }
    };

    const handleProfileEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.accountId) return;
        if (isSubmitting) return;
        setIsSubmitting(true);

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

            // Update Global Auth State (Triggers Header Update)
            updateUserState({
                name: payload.name,
                img: payload.img
            });

            setIsProfileEditModalOpen(false);
            showToast("프로필이 수정되었습니다.", "success");
        } catch (error) {
            console.error("Profile update failed", error);
            showToast("프로필 수정에 실패했습니다.", "error");
        } finally {
            setIsSubmitting(false);
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
                // showToast('작업에 실패했습니다.', 'error');
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
        if (isSubmitting) return;
        setIsSubmitting(true);
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
            await refreshBlocks('handleSaveBlock');
            setIsBlockModalOpen(false);
            setEditingBlock(null);
            showToast("블록이 성공적으로 저장되었습니다.", "success");
        } catch (error) {
            console.error("Failed to save block", error);
            showToast("블록 저장에 실패했습니다.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteBlock = (e: React.MouseEvent, id: string | number) => {
        e.stopPropagation();
        showAlert(
            "블록 삭제",
            "정말 이 블록을 삭제하시겠습니까?",
            "warning",
            async () => {
                closeAlert();
                try {
                    await deleteBlock(id);
                    await refreshBlocks('handleDeleteBlock');
                } catch (error) {
                    console.error("Failed to delete block", error);
                }
            }
        );
    };

    // --- Cover Letter Handlers ---


    const handleDeleteCoverLetter = (e: React.MouseEvent, id: string | number) => {
        e.stopPropagation();
        showAlert(
            "자소서 삭제",
            "정말 이 자소서를 삭제하시겠습니까?",
            "warning",
            async () => {
                closeAlert();
                try {
                    await deleteCoverLetter(id);
                    const res: any = await getCoverLetters();
                    setCoverLetters(res.data || []);
                } catch (error) {
                    console.error("Failed to delete cover letter", error);
                }
            }
        );
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
        // 제목 검증
        if (!manualCoverLetterForm.title.trim()) {
            showToast("자소서 제목을 입력해주세요.", "warning");
            return;
        }
        if (isSubmitting) return;
        setIsSubmitting(true);

        // 항목 개수 검증
        if (manualCoverLetterForm.essays.length === 0) {
            showToast("최소 1개의 항목을 추가해주세요.", "warning");
            return;
        }

        // 각 항목의 질문과 내용 검증
        for (let i = 0; i < manualCoverLetterForm.essays.length; i++) {
            const essay = manualCoverLetterForm.essays[i];

            if (!essay.question.trim()) {
                showToast(`${i + 1}번째 항목의 질문을 입력해주세요.`, "warning");
                return;
            }

            if (!essay.content.trim()) {
                showToast(`${i + 1}번째 항목의 내용을 입력해주세요.`, "warning");
                return;
            }
        }

        try {
            await createCoverLetter(manualCoverLetterForm);
            const res: any = await getCoverLetters();
            setCoverLetters(res.data || []);
            setIsManualCreateModalOpen(false);
            showToast("자소서가 성공적으로 생성되었습니다.", "success");
        } catch (error) {
            console.error("Failed to create manual cover letter", error);
            const errorMessage = parseErrorMessage(error);
            showToast(errorMessage, "error");
            // showToast("자소서 생성에 실패했습니다.", "error");
        } finally {
            setIsSubmitting(false);
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

    // --- TIL CRUD Handlers ---
    const handleEditTil = (tilId: number) => {
        setTilMenuOpen(null);
        // Fix: Use correct edit route path parameter
        navigate(`/til/edit/${tilId}`);
    };

    const handleDeleteTil = (tilId: number) => {
        console.log("Delete requested for TIL:", tilId); // Debug log
        showAlert(
            "TIL 삭제",
            "정말 삭제하시겠습니까?",
            "warning",
            async () => {
                closeAlert();

                try {
                    await deleteTIL(tilId);
                    // Refetch TILs
                    const tilsData = await getTILList({ authorId: targetUserId });
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
                    const filteredTils = extractedTils.filter((til: TILItem) => til.author.accountId === targetUserId);
                    setTils(filteredTils);
                    setTilMenuOpen(null);
                    setTilMenuOpen(null);
                    showAlert("삭제 완료", "TIL이 삭제되었습니다.", "success");
                } catch (error) {
                    console.error('Failed to delete TIL', error);
                    showAlert("삭제 실패", "TIL 삭제에 실패했습니다.", "error");
                }
            });
    };

    const handleImportToBlock = async (til: TILItem) => {
        // 이미 진행 중이면 중단
        if (isImportingTil) return;

        try {
            const idToSend = til.tilId;

            if (!idToSend) {
                console.error('[TIL Import] TIL object missing both communityId and tilId:', til);
                showAlert("오류", "TIL ID를 찾을 수 없습니다. 페이지를 새로고침해주세요.", "error");
                return;
            }

            // 로딩 시작
            setIsImportingTil(true);

            console.log('[TIL Import] Starting block generation for TIL:', idToSend);
            console.log('[TIL Import] Full TIL object:', til);
            const result = await generateBlockFromTIL(idToSend);
            console.log('[TIL Import] Block generation successful:', result);

            // 1. Manually update state for immediate UI feedback (Optimistic Update)
            const newBlockData = result.data || result;
            if (newBlockData) {
                const normalizedBlock = {
                    ...newBlockData,
                    id: newBlockData.id || newBlockData.blockId || Date.now() // Fallback ID if missing
                };
                setBlocks(prev => [normalizedBlock, ...prev]);
            }

            // 2. Switch to Blocks tab immediately
            setResumeTab('BLOCKS');

            // 3. Fetch latest data in background (delayed slightly to ensure DB consistency)
            setTimeout(() => {
                refreshBlocks('handleImportToBlock');
            }, 500);

            setTilMenuOpen(null);

            // 로딩 종료
            setIsImportingTil(false);

            // 결과 확인 - 다양한 응답 구조 대응
            let createdBlocks: any[] = [];
            if (Array.isArray(result)) {
                createdBlocks = result;
            } else if (result?.blocks && Array.isArray(result.blocks)) {
                createdBlocks = result.blocks;
            } else if (Array.isArray(result?.data)) {
                createdBlocks = result.data;
            } else if (result?.data?.blocks && Array.isArray(result.data.blocks)) {
                createdBlocks = result.data.blocks;
            }

            // Fix: Check for single block object response as well (since API might return just one object)
            // If createdBlocks is empty, check if the result itself looks like a block
            const hasBlocks = createdBlocks.length > 0 || (newBlockData && (newBlockData.id || newBlockData.blockId || newBlockData.title) && !newBlockData.blocks);

            // 알림 표시 (로딩 종료 후 표시)
            setTimeout(() => {
                if (hasBlocks) {
                    openAlert('저장 완료', '✨ 내 자소서 소재로 저장되었습니다!', 'success');
                } else {
                    openAlert('알림', '추출된 블럭이 없습니다.\n이미 생성된 블럭과 유사하거나 내용을 확인해주세요.', 'warning');
                }
            }, 100);

        } catch (error: any) {
            console.error('[TIL Import] Failed to import TIL to block');
            console.error('[TIL Import] Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                til: til
            });

            // 로딩 종료
            setIsImportingTil(false);

            // 실패 알림
            setTimeout(() => {
                openAlert('저장 실패', `블록 저장에 실패했습니다. (${error.response?.status || 'Unknown'})`, 'error');
            }, 100);
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
        if (!recordForm.title.trim()) {
            showToast("제목을 입력해주세요.", "warning");
            return;
        }
        if (!recordForm.organization.trim()) {
            showToast("소속을 입력해주세요.", "warning");
            return;
        }
        if (!recordForm.startDate) {
            showToast("시작일을 입력해주세요.", "warning");
            return;
        }
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (editingRecordId) {
                // Update
                await updateUserRecord(user.accountId, editingRecordId, recordForm);
            } else {
                // Create
                await createUserRecord(user.accountId, recordForm);
            }
            const res = await getUserRecords(user.accountId);
            setRecords(res || []);
            setIsRecordModalOpen(false);
            setEditingRecordId(null);
            setRecordForm({ title: '', description: '', startDate: '', endDate: '', organization: '' });
        } catch (error) {
            console.error(error);
            showToast('저장에 실패했습니다.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRecord = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!user?.accountId) return;

        showAlert(
            "삭제",
            "삭제하시겠습니까?",
            "warning",
            async () => {
                closeAlert();
                try {
                    await deleteUserRecord(user.accountId, id);
                    const res = await getUserRecords(user.accountId);
                    setRecords(res || []);
                } catch (e) { console.error(e); }
            }
        );
    };

    // --- Award Handlers ---
    const handleOpenAwardModal = (award: any = null) => {
        if (award) {
            setAwardForm({
                title: award.title || '',
                awardedAt: award.awardedAt || '',
                organization: award.organization || '',
                rankName: award.rankName || ''
            });
            setEditingAwardId(award.id);
        } else {
            setAwardForm({ title: '', awardedAt: '', organization: '', rankName: '' });
            setEditingAwardId(null);
        }
        setIsAwardModalOpen(true);
    };

    const handleSaveAward = async () => {
        if (!user?.accountId) return;
        if (!awardForm.title.trim()) {
            showToast("대회/공모전명을 입력해주세요.", "warning");
            return;
        }
        if (!awardForm.rankName.trim()) {
            showToast("상훈을 입력해주세요.", "warning");
            return;
        }
        if (!awardForm.organization.trim()) {
            showToast("수여 기관을 입력해주세요.", "warning");
            return;
        }
        if (!awardForm.awardedAt) {
            showToast("수상일을 입력해주세요.", "warning");
            return;
        }
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const payload = {
                title: awardForm.title,
                rankName: awardForm.rankName,
                organization: awardForm.organization,
                awardedAt: awardForm.awardedAt
            };

            if (editingAwardId) {
                await updateUserAward(user.accountId, editingAwardId, payload);
            } else {
                await createUserAward(user.accountId, payload);
            }

            const res = await getUserAwards(user.accountId);
            const rawAwards = res?.data?.awards || res?.awards || res || [];
            const mappedAwards = rawAwards.map((a: any) => ({
                id: a.awardId || a.id,
                title: a.title,
                rankName: a.rankName,
                organization: a.organization,
                awardedAt: a.awardedAt,
            }));
            setAwards(mappedAwards);

            setIsAwardModalOpen(false);
            setEditingAwardId(null);
            setAwardForm({ title: '', awardedAt: '', organization: '', rankName: '' });
            showToast("저장되었습니다.", "success");
        } catch (error) { console.error(error); showToast('저장 실패', 'error'); }
        finally { setIsSubmitting(false); }
    };

    const handleDeleteAward = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!user?.accountId) return;

        showAlert(
            "삭제",
            "삭제하시겠습니까?",
            "warning",
            async () => {
                closeAlert();
                try {
                    await deleteUserAward(user.accountId, id);
                    const res = await getUserAwards(user.accountId);
                    const rawAwards = res?.data?.awards || res?.awards || res || [];
                    const mappedAwards = rawAwards.map((a: any) => ({
                        id: a.awardId || a.id,
                        title: a.title,
                        rankName: a.rankName,
                        organization: a.organization,
                        awardedAt: a.awardedAt,
                    }));
                    setAwards(mappedAwards);
                    showToast("삭제되었습니다.", "success");
                } catch (error) { console.error(error); showToast('삭제 실패', 'error'); }
            }
        );
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
        if (!certForm.name.trim()) {
            showToast("자격증명을 입력해주세요.", "warning");
            return;
        }
        if (!certForm.issueDate) {
            showToast("취득일을 입력해주세요.", "warning");
            return;
        }
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (editingCertId) {
                await updateUserCertification(user.accountId, editingCertId, certForm);
            } else {
                await createUserCertification(user.accountId, certForm);
            }
            const res = await getUserCertifications(user.accountId);
            setCertifications(res || []);
            setIsCertModalOpen(false);
            setEditingCertId(null);
            setCertForm({ name: '', issuingOrganization: '', issueDate: '', expirationDate: '' });
        } catch (e) {
            console.error(e);
            showToast('저장 실패', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCert = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        if (!user?.accountId) return;
        showAlert(
            "삭제",
            "삭제하시겠습니까?",
            "warning",
            async () => {
                closeAlert();
                try {
                    await deleteUserCertification(user.accountId, id);
                    const res = await getUserCertifications(user.accountId);
                    setCertifications(res || []);
                } catch (e) { console.error(e); }
            }
        );
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mr-2"></div>
            Loading...
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 relative font-sans pt-20">
            {/* Loading Overlay */}
            <LoadingOverlay isOpen={isImportingTil} message="자소서 소재로 저장 중입니다..." />

            {/* Global Custom Alert */}
            <CustomAlert
                isOpen={alertState.isOpen}
                onClose={closeAlert}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                onConfirm={alertState.onConfirm}
                cancelText={undefined}
            />


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
                                <label className="block text-sm font-bold text-slate-600 mb-1">제목/활동명 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={recordForm.title}
                                    onChange={(e) => handleInputChangeWithLimit(setRecordForm, recordForm, 'title', e.target.value, 15, '제목')}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none font-bold text-slate-800"
                                    placeholder="예: SSAFY 14기"
                                />
                                <div className="text-right text-xs text-slate-400 mt-1">{recordForm.title.length}/15</div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">소속 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={recordForm.organization}
                                    onChange={(e) => handleInputChangeWithLimit(setRecordForm, recordForm, 'organization', e.target.value, 20, '소속')}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-slate-800"
                                    placeholder="예: 삼성청년SW아카데미"
                                />
                                <div className="text-right text-xs text-slate-400 mt-1">{recordForm.organization.length}/20</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-1">시작일 <span className="text-red-500">*</span></label>
                                    <input
                                        type="month"
                                        value={recordForm.startDate}
                                        onChange={(e) => {
                                            const newStart = e.target.value;
                                            if (recordForm.endDate && newStart > recordForm.endDate) {
                                                showToast("시작일은 종료일보다 늦을 수 없습니다.", "warning");
                                                return;
                                            }
                                            setRecordForm({ ...recordForm, startDate: newStart });
                                        }}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-600 mb-1">종료일 (진행중이면 비워두세요)</label>
                                    <input
                                        type="month"
                                        value={recordForm.endDate}
                                        onChange={(e) => {
                                            const newEnd = e.target.value;
                                            if (newEnd && recordForm.startDate && newEnd < recordForm.startDate) {
                                                showToast("종료일은 시작일보다 빠를 수 없습니다.", "warning");
                                                return;
                                            }
                                            setRecordForm({ ...recordForm, endDate: newEnd });
                                        }}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">설명</label>
                                <textarea
                                    value={recordForm.description}
                                    onChange={(e) => handleInputChangeWithLimit(setRecordForm, recordForm, 'description', e.target.value, 30, '설명')}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-32 resize-none outline-none text-slate-800"
                                    placeholder="어떤 활동을 했는지 간단히 적어보세요."
                                />
                                <div className="text-right text-xs text-slate-400 mt-1">{recordForm.description.length}/30</div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setIsRecordModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold disabled:opacity-50">취소</button>
                            <button onClick={handleSaveRecord} disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? '저장 중...' : '저장'}
                            </button>
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
                                <label className="block text-sm font-bold text-slate-600 mb-1">대회/공모전명 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={awardForm.title}
                                    onChange={(e) => handleInputChangeWithLimit(setAwardForm, awardForm, 'title', e.target.value, 20, '대회/공모전명')}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 font-bold"
                                    placeholder="예: 삼성 청년 SW 아카데미 프로젝트"
                                />
                                <div className="text-right text-xs text-slate-400 mt-1">{awardForm.title.length}/20</div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">상훈 (상 이름) <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={awardForm.rankName}
                                    onChange={(e) => handleInputChangeWithLimit(setAwardForm, awardForm, 'rankName', e.target.value, 20, '상훈')}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800"
                                    placeholder="예: 최우수상"
                                />
                                <div className="text-right text-xs text-slate-400 mt-1">{awardForm.rankName.length}/20</div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">수여 기관 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={awardForm.organization}
                                    onChange={(e) => handleInputChangeWithLimit(setAwardForm, awardForm, 'organization', e.target.value, 20, '수여 기관')}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800"
                                />
                                <div className="text-right text-xs text-slate-400 mt-1">{awardForm.organization.length}/20</div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">수상일 <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    value={awardForm.awardedAt}
                                    max={todayStr} // ✅ 오늘 이후 날짜 선택 불가 설정
                                    onChange={(e) => setAwardForm({ ...awardForm, awardedAt: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setIsAwardModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold disabled:opacity-50">취소</button>
                            <button onClick={handleSaveAward} disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? '저장 중...' : '저장'}
                            </button>
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
                                <label className="block text-sm font-bold text-slate-600 mb-1">자격증명 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={certForm.name}
                                    onChange={(e) => handleInputChangeWithLimit(setCertForm, certForm, 'name', e.target.value, 15, '자격증명')}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800 font-bold"
                                />
                                <div className="text-right text-xs text-slate-400 mt-1">{certForm.name.length}/15</div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">발급 기관</label>
                                <input
                                    type="text"
                                    value={certForm.issuingOrganization}
                                    onChange={(e) => handleInputChangeWithLimit(setCertForm, certForm, 'issuingOrganization', e.target.value, 15, '발급 기관')}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800"
                                />
                                <div className="text-right text-xs text-slate-400 mt-1">{certForm.issuingOrganization.length}/15</div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-600 mb-1">취득일 <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    value={certForm.issueDate}
                                    max={todayStr} // ✅ 오늘 이후 날짜 선택 불가 설정
                                    onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button onClick={() => setIsCertModalOpen(false)} disabled={isSubmitting} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-bold disabled:opacity-50">취소</button>
                            <button onClick={handleSaveCert} disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isSubmitting ? '저장 중...' : '저장'}
                            </button>
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
                            <div className={`w-full aspect-[4/3] rounded-xl ${generateGradient(selectedTilIndex)} flex items-center justify-center p-6`}>
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
                                    <div className="markdown-preview-wrapper text-slate-700 leading-relaxed theme-light">
                                        <MarkdownPreview markdown={tils[selectedTilIndex].content} />
                                    </div>
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
                {/* --- Header Redesign --- */}
                <header className="relative mb-6 pb-4 -mt-4">
                    {/* Minimal Separator Line - Moved to bottom */}
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                    {/* Profile Section - Clean Line-based Layout */}
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
                        {/* Profile Image - Sitting elegantly on the midline */}
                        <div className="relative shrink-0 z-10">
                            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-[4px] border-white shadow-md bg-white transition-all duration-500 hover:scale-105">
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
                                    className="absolute bottom-0 right-0 p-2 bg-white border border-slate-100 rounded-full text-slate-500 hover:text-indigo-600 shadow-md transition-all hover:rotate-12 active:scale-90"
                                >
                                    <Settings className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* Name & Bio & Stats - Minimalist Alignment */}
                        <div className="flex-1 pb-1 text-center md:text-left">
                            {/* Stacked Layout: Name Top, Stats Bottom, Left Aligned */}
                            <div className="flex flex-col items-start gap-3">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 ml-1 tracking-tight">
                                        {profile?.name || profile?.nickname || '...'}
                                    </h1>
                                </div>

                                {/* Stats - Integrated pills */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => openFollowModal('FOLLOWER')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group"
                                    >
                                        <span className="text-sm font-bold text-slate-400 group-hover:text-slate-500">팔로워</span>
                                        <span className="text-base font-black text-slate-800 group-hover:text-indigo-600">{profile?.followerCount ?? profile?.followersCount ?? 0}</span>
                                    </button>
                                    <button
                                        onClick={() => openFollowModal('FOLLOWING')}
                                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors group"
                                    >
                                        <span className="text-sm font-bold text-slate-400 group-hover:text-slate-500">팔로잉</span>
                                        <span className="text-base font-black text-slate-800 group-hover:text-indigo-600">{profile?.followeeCount ?? profile?.followingsCount ?? 0}</span>
                                    </button>
                                </div>
                            </div>

                            {!isOwnProfile && targetUserId && (
                                <button
                                    onClick={() => toggleFollow(targetUserId)}
                                    className={`mt-4 px-8 py-2.5 rounded-full font-black text-xs transition-all shadow-sm hover:shadow-md active:scale-95 ${isFollowingTarget
                                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
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
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-indigo-500" />
                                    <span>활동 스트릭</span>
                                </h2>
                                <div className="flex items-center gap-3">
                                    <div className="px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm flex flex-col items-center min-w-[100px]">
                                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">현재 스트릭</span>
                                        <span className="text-xl font-black text-indigo-600">{currentStreak}일</span>
                                    </div>
                                    <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center min-w-[100px]">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">최대 스트릭</span>
                                        <span className="text-xl font-black text-slate-700">{maxStreak}일</span>
                                    </div>
                                    <div className="px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center min-w-[100px]">
                                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">활동한 날</span>
                                        <span className="text-xl font-black text-slate-400">{activeDaysCount}일</span>
                                    </div>
                                </div>
                            </div>
                            <StreakGraph
                                streakData={streak}
                                selectedYear={selectedStreakYear}
                                onYearChange={setSelectedStreakYear}
                            />
                        </section>

                        {/* 2. TIL Visual Gallery */}
                        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-500" />
                                    <span>Today I Learned</span>
                                </h2>
                                <div className="flex items-center gap-4">
                                    {tils.length > 0 && (
                                        <span className="text-sm text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-full">
                                            {tils.length}개의 기록
                                        </span>
                                    )}
                                    {isOwnProfile && (
                                        <button
                                            onClick={() => navigate('/til/write')}
                                            className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                            title="TIL 작성하기"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {tils.length > 0 ? (
                                <div className="columns-2 md:columns-3 gap-5 h-[500px] overflow-y-scroll scrollbar-hide">
                                    {tils.map((til, index) => (
                                        <div
                                            key={til.tilId || index}
                                            className="break-inside-avoid mb-5 group inline-block w-full relative"
                                        >
                                            <div className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-slate-200">
                                                {/* Thumbnail or Gradient */}
                                                <div
                                                    className={`relative aspect-[4/3] ${generateGradient(index)} flex items-center justify-center p-6 cursor-pointer`}
                                                    onClick={() => handleOpenTilLightbox(index)}
                                                >
                                                    <h3 className="text-lg font-bold text-slate-700 text-center line-clamp-3 drop-shadow-sm whitespace-pre-wrap break-all">
                                                        {til.title}
                                                    </h3>

                                                    {/* More Menu Button (Only for owner) */}
                                                    {isOwnProfile && (
                                                        <div className="absolute top-2 right-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const tilId = til.tilId || 0;
                                                                    setTilMenuOpen(tilMenuOpen === tilId ? null : tilId);
                                                                }}
                                                                className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-md backdrop-blur-sm transition-all"
                                                            >
                                                                <MoreVertical className="w-4 h-4 text-slate-600" />
                                                            </button>

                                                            {/* Dropdown Menu */}
                                                            {tilMenuOpen === (til.tilId) && (
                                                                <>
                                                                    {/* Overlay to close menu */}
                                                                    <div
                                                                        className="fixed inset-0 z-10"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setTilMenuOpen(null);
                                                                        }}
                                                                    />
                                                                    {/* Menu */}
                                                                    <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleEditTil(til.tilId || 0);
                                                                            }}
                                                                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                                        >
                                                                            <Edit2 className="w-4 h-4" />
                                                                            수정하기
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDeleteTil(til.tilId || 0);
                                                                            }}
                                                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                            삭제하기
                                                                        </button>
                                                                        <div className="border-t border-slate-100 my-1" />
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleImportToBlock(til);
                                                                            }}
                                                                            className="w-full px-4 py-2 text-left text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 font-medium"
                                                                        >
                                                                            <Sparkles className="w-4 h-4" />
                                                                            블록으로 생성하기
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Card Footer */}
                                                <div
                                                    className="p-3 bg-white border-t border-slate-100 cursor-pointer"
                                                    onClick={() => handleOpenTilLightbox(index)}
                                                >
                                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                                        <span className="flex items-center gap-1">
                                                            <Activity className="w-3 h-3" />
                                                            {til.view || 0} views
                                                        </span>
                                                        <span>{new Date(til.createdAt || Date.now()).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1 mt-2 min-h-[24px]">
                                                        {til.tags && til.tags.length > 0 ? (
                                                            til.tags.slice(0, 3).map((tag, idx) => (
                                                                <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md">
                                                                    #{tag}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="invisible">placeholder</span>
                                                        )}
                                                    </div>
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
                                                            <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors whitespace-pre-wrap break-all line-clamp-1">
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
                                                        <p className="text-xs text-slate-600 line-clamp-3 mb-2 h-[42px] leading-relaxed whitespace-pre-wrap break-all overflow-hidden">
                                                            {block.content}
                                                        </p>
                                                        <div className="flex items-end justify-between mt-3 gap-2">
                                                            {/* 왼쪽: 카테고리 태그 */}
                                                            <div className="flex flex-wrap gap-1">
                                                                {(block.categories || []).map((code: number) => (
                                                                    <span key={code} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md border border-indigo-100">
                                                                        #{(BLOCK_CATEGORY_MAP as Record<number, string>)[code] || '기타'}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            {/* 오른쪽: 소스 정보 */}
                                                            {block.sourceType && block.sourceTitle && (
                                                                <div className="text-[10px] text-slate-400 flex items-center gap-1 ml-2 shrink-0">
                                                                    {(() => {
                                                                        const IconComponent = SOURCE_TYPE_ICONS[block.sourceType];
                                                                        return IconComponent ? <IconComponent className="w-3 h-3" /> : null;
                                                                    })()}
                                                                    <span>{getSourceText(block.sourceType, block.sourceTitle)}</span>
                                                                </div>
                                                            )}
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
                        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md overflow-visible">
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
                            <div className="relative pl-10 border-l-2 border-slate-100 h-[360px] overflow-y-scroll scrollbar-hide">
                                <div className="space-y-4">
                                    {records.length > 0 ? (
                                        records.map((record, idx) => {
                                            return (
                                                <div key={record.id || idx} className="relative group/item">
                                                    <span className={`absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-white border-4 ${idx === 0 ? 'border-indigo-500' : 'border-slate-300'} shadow-sm transition-colors z-10`}></span>
                                                    <div className="flex items-start justify-between gap-2 mb-0.5">
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="font-bold text-slate-800 text-sm" title={record.title || record.name}>
                                                                {truncateText(record.title || record.name, 15)}
                                                            </h3>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md whitespace-nowrap">
                                                                {record.startDate} {record.endDate ? `~ ${record.endDate}` : ''}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                                        {record.organization && <p className="text-xs text-slate-500 truncate">{record.organization}</p>}
                                                        {isOwnProfile && (
                                                            <div className="flex gap-1 flex-shrink-0">
                                                                <button onClick={() => handleOpenRecordModal(record)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
                                                                <button onClick={(e) => handleDeleteRecord(e, record.id)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {(record.description || record.details) && (
                                                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{record.description || record.details || ''}</p>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-8 text-slate-400 text-sm">
                                            아직 등록된 이력이 없습니다.
                                        </div>
                                    )}
                                </div>
                            </div>

                        </section>

                        {/* 3. Awards & Certifications */}
                        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 whitespace-normal">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    <span>수상 및 자격증</span>
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {/* Awards */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2">🏆 수상 이력</h3>
                                        {isOwnProfile && (
                                            <button onClick={() => handleOpenAwardModal()} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-colors">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-3 h-[360px] overflow-y-auto">
                                        {awards.length > 0 ? (
                                            awards.slice((awardPage - 1) * ITEMS_PER_PAGE, awardPage * ITEMS_PER_PAGE).map((award, idx) => (
                                                <div key={award.id || idx} className="flex items-start justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/30 transition-colors group/item">
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="font-bold text-slate-800 text-sm" title={award.title}>{truncateText(award.title, 20)}</h4>
                                                        {award.rankName && <p className="text-xs text-slate-500 mt-0.5" title={award.rankName}>{truncateText(award.rankName, 20)}</p>}
                                                        <p className="text-xs text-slate-400 mt-0.5">
                                                            {award.awardedAt}{award.organization && <> • <span title={award.organization}>{truncateText(award.organization, 20)}</span></>}
                                                        </p>
                                                    </div>
                                                    {isOwnProfile && (
                                                        <div className="flex gap-1 flex-shrink-0">
                                                            <button onClick={() => handleOpenAwardModal(award)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
                                                            <button onClick={(e) => handleDeleteAward(e, award.id)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : <div className="text-xs text-slate-400 py-2">등록된 수상 이력이 없습니다.</div>}
                                    </div>
                                    {awards.length > ITEMS_PER_PAGE && (
                                        <div className="flex justify-center items-center gap-3 pt-4">
                                            <button
                                                onClick={() => setAwardPage(p => Math.max(1, p - 1))}
                                                disabled={awardPage === 1}
                                                className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors text-slate-500"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <div className="flex items-center gap-2.5">
                                                {Array.from({ length: Math.ceil(awards.length / ITEMS_PER_PAGE) }).map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setAwardPage(i + 1)}
                                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${awardPage === i + 1 ? 'w-8 bg-indigo-500' : 'bg-slate-200 hover:bg-slate-300'}`}
                                                        aria-label={`Page ${i + 1}`}
                                                    />
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setAwardPage(p => Math.min(Math.ceil(awards.length / ITEMS_PER_PAGE), p + 1))}
                                                disabled={awardPage === Math.ceil(awards.length / ITEMS_PER_PAGE)}
                                                className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors text-slate-500"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Certifications */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-bold text-slate-400 uppercase flex items-center gap-2">📜 자격증</h3>
                                        {isOwnProfile && (
                                            <button onClick={() => handleOpenCertModal()} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-colors">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-3 h-[300px] overflow-y-auto">
                                        {certifications.length > 0 ? (
                                            certifications.slice((certPage - 1) * ITEMS_PER_PAGE, certPage * ITEMS_PER_PAGE).map((cert, idx) => (
                                                <div key={cert.id || idx} className="flex items-start justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/30 transition-colors group/item">
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="font-bold text-slate-800 text-sm truncate" title={cert.name}>{truncateText(cert.name, 15)}</h4>
                                                        <p className="text-xs text-slate-500 truncate mt-0.1">
                                                            <span className="text-slate-400">{cert.issueDate}</span>
                                                            {(cert.issuingOrganization || cert.issuer) && <> • <span title={cert.issuingOrganization || cert.issuer}>{truncateText(cert.issuingOrganization || cert.issuer, 15)}</span></>}
                                                        </p>
                                                        {cert.description && <p className="text-[10px] text-slate-600 line-clamp-1 mt-1">{cert.description}</p>}
                                                    </div>
                                                    {isOwnProfile && (
                                                        <div className="flex gap-1">
                                                            <button onClick={() => handleOpenCertModal(cert)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
                                                            <button onClick={(e) => handleDeleteCert(e, cert.id)} className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : <div className="text-xs text-slate-400 py-2">등록된 자격증이 없습니다.</div>}
                                    </div>
                                    {certifications.length > ITEMS_PER_PAGE && (
                                        <div className="flex justify-center items-center gap-3 pt-4">
                                            <button
                                                onClick={() => setCertPage(p => Math.max(1, p - 1))}
                                                disabled={certPage === 1}
                                                className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors text-slate-500"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <div className="flex items-center gap-2.5">
                                                {Array.from({ length: Math.ceil(certifications.length / ITEMS_PER_PAGE) }).map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCertPage(i + 1)}
                                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${certPage === i + 1 ? 'w-8 bg-indigo-500' : 'bg-slate-200 hover:bg-slate-300'}`}
                                                        aria-label={`Page ${i + 1}`}
                                                    />
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setCertPage(p => Math.min(Math.ceil(certifications.length / ITEMS_PER_PAGE), p + 1))}
                                                disabled={certPage === Math.ceil(certifications.length / ITEMS_PER_PAGE)}
                                                className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 transition-colors text-slate-500"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* 4. Bookmarked Recruitments (Interested) */}
                        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                                    <Bookmark className="w-5 h-5 text-pink-500" />
                                    <span>관심 채용 공고</span>
                                </h2>
                                <button
                                    onClick={() => {
                                        navigate('/recruitments');
                                        window.scrollTo(0, 0);
                                    }}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group/btn"
                                >
                                    채용 공고 보러가기
                                    <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                                </button>
                            </div>

                            {((bookmarkedRecruitments || []).filter(item => item.dday <= 0).sort((a, b) => b.dday - a.dday)).length > 0 ? (
                                <>
                                    <div className="flex flex-col gap-2 min-h-[280px]">
                                        {(bookmarkedRecruitments || [])
                                            .filter(item => item.dday <= 0)
                                            .sort((a, b) => b.dday - a.dday)
                                            .slice((recruitPage - 1) * RECRUIT_ITEMS_PER_PAGE, recruitPage * RECRUIT_ITEMS_PER_PAGE)
                                            .map((recruitment, idx) => (
                                                <div
                                                    key={recruitment.recruitmentId || idx}
                                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group"
                                                    onClick={() => navigate(`/recruitments/${recruitment.recruitmentId}`)}
                                                >
                                                    <div className="flex-1 min-w-0 mr-4">
                                                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors whitespace-pre-wrap break-all line-clamp-2 block">
                                                            {recruitment.companyName}
                                                        </span>
                                                    </div>
                                                    <span className={`text-[10px] font-black px-2 py-1 rounded-md ${recruitment.dday > 0
                                                        ? 'bg-slate-200 text-slate-600'
                                                        : recruitment.dday === 0
                                                            ? 'bg-red-100 text-red-600'
                                                            : 'bg-indigo-100 text-indigo-600'
                                                        }`}>
                                                        {recruitment.dday === 0 ? 'D-Day' : recruitment.dday > 0 ? `D+${recruitment.dday}` : `D${recruitment.dday}`}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                    {(bookmarkedRecruitments || []).filter(item => item.dday <= 0).length > RECRUIT_ITEMS_PER_PAGE && (
                                        <div className="flex justify-center items-center gap-4 mt-6">
                                            <button
                                                onClick={() => setRecruitPage(p => Math.max(1, p - 1))}
                                                disabled={recruitPage === 1}
                                                className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-500"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>
                                            <div className="flex items-center gap-2.5">
                                                {Array.from({ length: Math.ceil((bookmarkedRecruitments || []).filter(item => item.dday <= 0).length / RECRUIT_ITEMS_PER_PAGE) }).map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setRecruitPage(i + 1)}
                                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${recruitPage === i + 1 ? 'w-8 bg-indigo-500' : 'bg-slate-200 hover:bg-slate-300'}`}
                                                        aria-label={`Page ${i + 1}`}
                                                    />
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => setRecruitPage(p => Math.min(Math.ceil((bookmarkedRecruitments || []).filter(item => item.dday <= 0).length / RECRUIT_ITEMS_PER_PAGE), p + 1))}
                                                disabled={recruitPage === Math.ceil((bookmarkedRecruitments || []).filter(item => item.dday <= 0).length / RECRUIT_ITEMS_PER_PAGE)}
                                                className="p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-500"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8 text-slate-400 text-sm">
                                    아직 관심 공고가 없습니다.
                                </div>
                            )}
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
                    </div >
                </div >
            </div >

            {/* --- Cover Letter Creation Selection Modal --- */}
            {
                isCreateSelectionModalOpen && (
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
                )
            }

            {/* --- Manual Cover Letter Create Modal --- */}
            {
                isManualCreateModalOpen && (
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
                                        onChange={(e) => handleInputChangeWithLimit(setManualCoverLetterForm, manualCoverLetterForm, 'title', e.target.value, 50, '자소서 제목')}
                                        placeholder="예: 2024 상반기 삼성전자 웹개발자 지원"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-800"
                                    />
                                    <div className="text-right text-xs text-slate-400 mt-1">{manualCoverLetterForm.title.length}/50</div>
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
                                                        onChange={(e) => {
                                                            if (e.target.value.length <= 100) {
                                                                handleManualEssayChange(idx, 'question', e.target.value);
                                                            }
                                                        }}
                                                        placeholder={`질문을 입력하세요 (예: ${idx + 1}. 지원 동기 및 비전)`}
                                                        className="w-full px-0 py-2 bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 max-w-full"
                                                    />
                                                    <div className="text-right text-xs text-slate-400 mt-1">{essay.question.length}/100</div>
                                                </div>
                                                <div>
                                                    <textarea
                                                        value={essay.content}
                                                        onChange={(e) => {
                                                            const limit = essay.charMax > 0 ? essay.charMax : 3000;
                                                            if (e.target.value.length <= limit) {
                                                                handleManualEssayChange(idx, 'content', e.target.value);
                                                            }
                                                        }}
                                                        placeholder="내용을 입력하세요..."
                                                        className="w-full min-h-[150px] p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-colors text-slate-800"
                                                    />
                                                    <div className="text-right text-xs text-slate-400 mt-1">{essay.content.length}/{essay.charMax > 0 ? essay.charMax : 3000}</div>
                                                </div>
                                                <div className="flex justify-end items-center gap-3">
                                                    <span className="text-[10px] font-bold text-slate-400">최대 글자수</span>
                                                    <input
                                                        type="number"
                                                        value={essay.charMax}
                                                        onChange={(e) => handleManualEssayChange(idx, 'charMax', parseInt(e.target.value) || 0)}
                                                        className="w-20 px-2 py-1 text-xs border border-slate-200 rounded text-center outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
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
                                    disabled={isSubmitting}
                                    className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? '저장 중...' : '저장하기'}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* --- Profile Edit Modal --- */}
            {
                isProfileEditModalOpen && (
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
                                        onChange={(e) => handleInputChangeWithLimit(setProfileEditForm, profileEditForm, 'name', e.target.value, 10, '이름')}
                                        required
                                        placeholder="이름을 입력하세요"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 shadow-inner"
                                    />
                                    <div className="text-right text-xs text-slate-400 mt-1">{profileEditForm.name.length}/10</div>
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
                                        disabled={isImageUploading || isSubmitting}
                                        className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? '저장 중...' : '저장하기'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Toast */}
            {
                toast.visible && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        isVisible={toast.visible}
                        onClose={closeToast}
                    />
                )
            }
        </div >
    );
};

export default MyPage;