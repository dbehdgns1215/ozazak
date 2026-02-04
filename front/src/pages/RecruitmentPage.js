import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Heart, ChevronDown, ChevronLeft, ChevronRight, X, Clock, MapPin, Building, Sparkles, ExternalLink, Share2 } from 'lucide-react';
import { getRecruitments, getRecruitmentDetail, addBookmark, deleteBookmark } from '../api/recruitment';
import { JOB_CATEGORIES, JOB_CATEGORY_LIST } from '../constants/jobCategories';
import CustomAlert from '../components/CustomAlert';

// --- Helpers & Visuals from JobCalendarPage ---
const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const filterOptions = {
    기업분류: ['전체', '대기업', '중견기업', '중소기업', '스타트업', '공기업', '외국계'],
    직무: JOB_CATEGORY_LIST,
    날짜기준: ['전체', '마감일까지', '시작일부터']
};

const filterKeyMap = {
    기업분류: 'companySize',
    직무: 'jobType',
    날짜기준: 'dateType'
};
const colors = [
    'bg-indigo-100 text-indigo-800',
    'bg-yellow-200 text-yellow-800',
    'bg-orange-200 text-orange-800',
    'bg-green-200 text-green-800',
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800'
];

const generateCalendarDays = (year, month) => {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDay.getDay();
    for (let i = startDayOfWeek; i > 0; i--) {
        const prevDate = new Date(year, month, 1 - i);
        days.push({ date: prevDate, isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        const currentDate = new Date(year, month, i);
        days.push({ date: currentDate, isCurrentMonth: true });
    }

    const endDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - endDayOfWeek; i++) {
        const nextDate = new Date(year, month + 1, i);
        days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
};

// --- Mini Calendar Tooltip ---
const MiniCalendar = ({ job, displayYear, displayMonth }) => {
    const startDate = new Date(job.start);
    const endDate = new Date(job.end);

    // 현재 달력의 월 기준으로 표시
    const year = displayYear;
    const month = displayMonth;
    const days = generateCalendarDays(year, month);

    // 시작일/마감일을 자정 기준으로 정규화
    const startTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
    const endTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();

    return (
        <div className="p-4 bg-white rounded-xl shadow-2xl border w-[220px]">
            <h3 className="font-bold text-lg text-gray-900">{job.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{job.role}</p>
            <p className="text-center font-bold text-sm my-2 text-gray-800">{`${year}.${String(month + 1).padStart(2, '0')}`}</p>
            <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
                {['일', '월', '화', '수', '목', '금', '토'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 text-center text-xs">
                {days.map(({ date, isCurrentMonth }, i) => {
                    const cellTime = date.getTime();
                    const isStart = cellTime === startTime;
                    const isEnd = cellTime === endTime;
                    const isBetween = cellTime > startTime && cellTime < endTime;

                    let bgClass = '';
                    let roundedClass = 'rounded-full';

                    if (isStart || isEnd) {
                        bgClass = 'bg-blue-500 text-white';
                        roundedClass = 'rounded-full';
                    } else if (isBetween) {
                        bgClass = 'bg-blue-100 text-blue-800';
                        roundedClass = '';
                    }

                    return (
                        <span key={i} className={`py-1 ${roundedClass} 
                            ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'} 
                            ${bgClass}`}>
                            {date.getDate()}
                        </span>
                    );
                })}
            </div>
            <div className="border-t mt-3 pt-3 text-xs text-gray-600">
                <p>시작: {(job.startDateTime || job.start).replace('T', ' ')}</p>
                <p>마감: {(job.endDateTime || job.end).replace('T', ' ')}</p>
            </div>
        </div>
    );
};

const FilterDropdown = ({ label, options, value, onChange, isOpen, onToggle }) => (
    <div className="relative">
        <button
            onClick={onToggle}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
            {label} ({value})
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
            <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border z-50 min-w-[120px] py-1 max-h-60 overflow-y-auto">
                {options.map(option => (
                    <button
                        key={option}
                        onClick={() => { onChange(option); onToggle(); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 
                            ${value === option ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        )}
    </div>
);

const JobFilterDropdown = ({ value, onChange, isOpen, onToggle }) => {
    const [hoveredMajor, setHoveredMajor] = useState(null);
    const [hoveredMiddle, setHoveredMiddle] = useState(null);

    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                직무 ({value})
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border z-50 flex overflow-hidden min-w-[480px] max-h-[400px]">
                    {/* Level 1: 대분류 */}
                    <div className="w-1/3 overflow-y-auto border-r custom-scrollbar bg-white">
                        {JOB_CATEGORY_LIST.map(cat => {
                            if (cat === '전체') return (
                                <button
                                    key={cat}
                                    onClick={() => { onChange(cat); onToggle(); }}
                                    className={`w-full text-left px-4 py-3 text-sm font-medium border-b
                                        ${value === cat ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    전체
                                </button>
                            );

                            const isSelected = value === cat;
                            const isHovered = hoveredMajor === cat;

                            return (
                                <div
                                    key={cat}
                                    onMouseEnter={() => { setHoveredMajor(cat); setHoveredMiddle(null); }}
                                    onClick={() => { onChange(cat); onToggle(); }}
                                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors
                                        ${isSelected ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                                        ${isHovered ? 'bg-gray-100' : ''}`}
                                >
                                    {cat}
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                            );
                        })}
                    </div>

                    {/* Level 2: 중분류 (대분류 Hover 시) */}
                    <div className="w-1/3 overflow-y-auto border-r custom-scrollbar bg-gray-50">
                        {hoveredMajor && JOB_CATEGORIES[hoveredMajor] ? (
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => { onChange(hoveredMajor); onToggle(); }}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-200 rounded-md mb-2"
                                >
                                    {hoveredMajor} 전체
                                </button>
                                {Object.keys(JOB_CATEGORIES[hoveredMajor]).map(middle => (
                                    <div
                                        key={middle}
                                        onMouseEnter={() => setHoveredMiddle(middle)}
                                        onClick={() => { onChange(middle); onToggle(); }}
                                        className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between cursor-pointer rounded-md
                                            ${value === middle ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-200'}
                                            ${hoveredMiddle === middle ? 'bg-gray-200' : ''}`}
                                    >
                                        {middle}
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs text-gray-400 p-4">
                                대분류를 선택하세요
                            </div>
                        )}
                    </div>

                    {/* Level 3: 소분류 (중분류 Hover 시) */}
                    <div className="w-1/3 overflow-y-auto custom-scrollbar bg-gray-100">
                        {hoveredMajor && hoveredMiddle && JOB_CATEGORIES[hoveredMajor][hoveredMiddle] ? (
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={() => { onChange(hoveredMiddle); onToggle(); }}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-200 rounded-md mb-2"
                                >
                                    전체
                                </button>
                                {JOB_CATEGORIES[hoveredMajor][hoveredMiddle].map(minor => (
                                    <button
                                        key={minor}
                                        onClick={() => { onChange(minor); onToggle(); }}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors
                                            ${value === minor ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {minor}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs text-gray-400 p-4">
                                중분류를 선택하세요
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const DateFilterDropdown = ({ startDate, endDate, onStartDateChange, onEndDateChange, isOpen, onToggle }) => {
    const formatDate = (date) => {
        if (!date) return '';
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const getDisplayText = () => {
        if (!startDate && !endDate) return '전체';
        if (startDate && endDate) return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
        if (startDate) return `${formatDate(startDate)} ~`;
        if (endDate) return `~ ${formatDate(endDate)}`;
        return '전체';
    };

    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                날짜 ({getDisplayText()})
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border z-50 p-3 min-w-[280px]">
                    {/* 선택된 범위 미리보기 */}
                    <div className="mb-3 p-2 bg-blue-50 rounded-md text-center text-sm text-blue-700 font-medium">
                        {startDate || endDate
                            ? `${startDate ? formatDate(startDate) : '시작일'} ~ ${endDate ? formatDate(endDate) : '종료일'}`
                            : '날짜를 선택하세요'
                        }
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">시작일</label>
                            <input
                                type="date"
                                value={startDate ? formatDate(startDate) : ''}
                                onChange={(e) => onStartDateChange(e.target.value ? new Date(e.target.value) : null)}
                                className="w-full px-2 py-1.5 border rounded-md text-sm text-gray-900 bg-white"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">종료일</label>
                            <input
                                type="date"
                                value={endDate ? formatDate(endDate) : ''}
                                onChange={(e) => onEndDateChange(e.target.value ? new Date(e.target.value) : null)}
                                className="w-full px-2 py-1.5 border rounded-md text-sm text-gray-900 bg-white"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => { onStartDateChange(null); onEndDateChange(null); }}
                            className="flex-1 px-3 py-2 border rounded-md text-sm hover:bg-gray-50 text-gray-900 bg-white"
                        >
                            초기화
                        </button>
                        <button
                            onClick={onToggle}
                            className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
                        >
                            적용
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const RecruitmentDetailModal = ({ jobId, onClose }) => {
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await getRecruitmentDetail(jobId);
                const data = res.data;
                setJob({
                    id: data.recruitmentId,
                    company: data.companyName,
                    companyImg: data.companyImg, // Assuming backend provides this
                    title: data.title,
                    posterImage: data.content,
                    workplaceInfo: data.companyLocation,
                    address: data.companyLocation,
                    dDay: data.dday,
                    deadline: data.endedAt,
                    applyUrl: data.applyUrl,
                    questions: data.questions,
                    isBookmarked: data.bookmarked,
                    tags: data.tags || [],
                    description: data.description || ""
                });
                setIsBookmarked(data.bookmarked);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        if (jobId) load();
    }, [jobId]);

    const handleBookmarkToggle = async () => {
        try {
            if (isBookmarked) {
                await deleteBookmark(job.id);
            } else {
                await addBookmark(job.id);
            }
            setIsBookmarked(!isBookmarked);
        } catch (error) {
            console.error('북마크 실패:', error);
        }
    };

    const handleGenerateCoverLetter = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        try {
            const { checkCoverLetter } = await import('../api/coverLetter');
            const response = await checkCoverLetter(job.id);
            const coverLetterId = response.data.coverLetterId;
            navigate(`/generate?coverLetterId=${coverLetterId}&recruitmentId=${job.id}`);
        } catch (error) {
            console.error('자소서 생성 실패:', error);
            alert('자소서 생성에 실패했습니다.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (!jobId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-slate-900/95 border border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fade-in" onClick={e => e.stopPropagation()}>

                <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-800/50 hover:bg-slate-700 text-white rounded-full transition-colors z-10">
                    <X className="w-6 h-6" />
                </button>

                {loading ? (
                    <div className="h-96 flex items-center justify-center text-white">Loading...</div>
                ) : job ? (
                    <div className="text-white">
                        {/* Header Section */}
                        <div className="p-8 md:p-10 pb-0">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-2xl font-bold text-slate-900 shadow-lg">
                                        {job.company[0]}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold mb-1">{job.title}</h1>
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <span className="flex items-center gap-1 font-medium text-white">
                                                <Building className="w-4 h-4" /> {job.company}
                                            </span>
                                            <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" /> {job.workplaceInfo}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end pt-2">
                                    <div className="px-4 py-2 bg-red-500/20 text-red-400 font-bold rounded-lg border border-red-500/30 flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4" /> D-{job.dDay}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {job.tags && job.tags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm border border-slate-700">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-8 md:p-10 space-y-8">
                            {/* Poster Image */}
                            <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative group">
                                <img
                                    src={job.posterImage}
                                    alt={job.title}
                                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Description */}
                            <div className="glass-dark p-8 rounded-3xl border border-white/5 bg-slate-800/30">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-yellow-400" /> 상세 요강
                                </h2>
                                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-line">
                                    {job.description}
                                </div>
                            </div>

                            {/* Workplace Info */}
                            <div className="glass-dark p-8 rounded-3xl border border-white/5 bg-slate-800/30">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 bg-slate-800 rounded-xl h-48 flex items-center justify-center text-slate-500 border border-slate-700">
                                        Map Placeholder
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="font-bold text-lg mb-2">{job.workplaceInfo}</h3>
                                        <p className="text-slate-400 mb-4">{job.address}</p>
                                        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm self-start transition-colors">
                                            길찾기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action Bar */}
                        <div className="sticky bottom-0 bg-slate-900/95 border-t border-white/10 p-6 md:px-10 rounded-b-3xl backdrop-blur-xl">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleBookmarkToggle}
                                        className={`flex flex-col items-center gap-1 min-w-[60px] ${isBookmarked ? 'text-red-400' : 'text-slate-400'} hover:text-red-400 transition-colors`}
                                    >
                                        <Heart className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} />
                                        <span className="text-xs font-medium">관심</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-1 min-w-[60px] text-slate-400 hover:text-white transition-colors">
                                        <Share2 className="w-6 h-6" />
                                        <span className="text-xs font-medium">공유</span>
                                    </button>
                                </div>

                                <div className="flex items-center gap-3 flex-1 justify-end">
                                    <button
                                        onClick={handleGenerateCoverLetter}
                                        disabled={isGenerating}
                                        className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        {isGenerating ? '생성 중...' : '자소서 생성하기'}
                                    </button>
                                    <button className="flex-1 md:flex-none px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                                        지원하러 가기 <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-96 flex items-center justify-center text-white">Job not found</div>
                )}
            </div>
        </div>
    );
};


const RecruitmentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Initial State
    const [searchParams, setSearchParams] = useSearchParams();
    const initialYear = parseInt(searchParams.get('year')) || new Date().getFullYear();
    const initialMonth = parseInt(searchParams.get('month')) || new Date().getMonth();
    const [currentDate, setCurrentDate] = useState(new Date(initialYear, initialMonth, 1));
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState(location.state?.message || '');

    const [activeFilters, setActiveFilters] = useState({
        companySize: '전체',
        jobType: '전체',
        startDate: null,   // 시작일 (Date 객체)
        endDate: null      // 종료일 (Date 객체)
    });
    const [openFilter, setOpenFilter] = useState(null);

    // Modal State
    const [selectedJobId, setSelectedJobId] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                console.log(`Fetching recruitments for ${year}-${month}`);

                const res = await getRecruitments({ year, month });
                console.log('API Response:', res);

                if (!res.data || !Array.isArray(res.data)) {
                    setJobs([]);
                    return;
                }

                const formatted = res.data.map((item, idx) => {
                    const job = item.data || item; // Handle nested data property
                    return {
                        id: job.recruitmentId,
                        name: job.companyName,
                        role: job.title,
                        companySize: job.companySize,
                        start: job.startedAt ? job.startedAt.substring(0, 10) : '',
                        end: job.endedAt ? job.endedAt.substring(0, 10) : '',
                        startDateTime: job.startedAt,
                        endDateTime: job.endedAt,
                        dDay: job.dday,
                        liked: job.bookmarked,
                        color: colors[idx % colors.length]
                    };
                });

                // 데이터 그룹핑 (같은 기업 + 같은 기간)
                const grouped = formatted.reduce((acc, job) => {
                    const key = `${job.name}_${job.start}_${job.end}`;
                    if (!acc[key]) {
                        acc[key] = {
                            ...job,
                            count: 1,
                            jobIds: [job.id],
                            jobs: [job]  // 전체 공고 저장
                        };
                    } else {
                        acc[key].count += 1;
                        acc[key].jobIds.push(job.id);
                        acc[key].jobs.push(job);
                    }
                    return acc;
                }, {});

                const finalJobs = Object.values(grouped);
                console.log('Grouped Jobs:', finalJobs);
                setJobs(finalJobs);
            } catch (e) {
                console.error('Failed to load recruitments:', e);
                setJobs([]);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [currentDate.getFullYear(), currentDate.getMonth()]); // 연/월 변경 시 재로딩

    const filteredJobs = useMemo(() => {
        let result = [...jobs];

        // 기업분류 필터
        if (activeFilters.companySize !== '전체') {
            result = result.filter(job => job.companySize === activeFilters.companySize);
        }

        // 직무 필터
        if (activeFilters.jobType !== '전체') {
            const selected = activeFilters.jobType;

            // 키워드 확장 함수: 선택된 항목 하위의 모든 키워드 수집
            const getKeywords = (term) => {
                const keywords = new Set([term]);

                // 1. 대분류인 경우
                if (JOB_CATEGORIES[term]) {
                    const middleCats = JOB_CATEGORIES[term];
                    Object.keys(middleCats).forEach(mid => {
                        keywords.add(mid);
                        middleCats[mid].forEach(min => keywords.add(min));
                    });
                    return Array.from(keywords);
                }

                // 2. 중분류인 경우 (모든 대분류 검색)
                for (const major in JOB_CATEGORIES) {
                    const middleCats = JOB_CATEGORIES[major];
                    if (middleCats[term]) {
                        middleCats[term].forEach(min => keywords.add(min));
                        return Array.from(keywords);
                    }
                }

                // 3. 소분류 등 기타 (자신만 리턴)
                return Array.from(keywords);
            };

            const targetKeywords = getKeywords(selected);

            result = result.filter(job => {
                const jobsRole = job.role || '';
                return targetKeywords.some(keyword => jobsRole.includes(keyword));
            });
        }

        // 날짜 필터 (범위)
        if (activeFilters.startDate || activeFilters.endDate) {
            const formatDateStr = (date) => {
                if (!date) return null;
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            };

            const filterStartStr = activeFilters.startDate ? formatDateStr(activeFilters.startDate) : null;
            const filterEndStr = activeFilters.endDate ? formatDateStr(activeFilters.endDate) : null;

            console.log('filterStartStr:', filterStartStr);
            console.log('filterEndStr:', filterEndStr);

            result = result.filter(job => {
                // 시작일 필터: 공고 마감일이 선택한 시작일 이후
                if (filterStartStr && job.end < filterStartStr) return false;

                // 종료일 필터: 공고 마감일이 선택한 종료일 이전
                if (filterEndStr && job.end > filterEndStr) return false;

                return true;
            });
        }

        console.log('필터 후 개수:', result.length);

        // 마감일 기준 정렬 (기본)
        result.sort((a, b) => new Date(a.end) - new Date(b.end));

        return result;
    }, [jobs, activeFilters]);

    const handleBookmarkToggle = async (e, jobId) => {
        e.stopPropagation();

        const job = jobs.find(j => j.id === jobId || j.jobIds?.includes(jobId));
        if (!job) return;

        try {
            if (job.liked) {
                await deleteBookmark(jobId);
            } else {
                await addBookmark(jobId);
            }

            setJobs(prevJobs => prevJobs.map(j => {
                if (j.id === jobId || j.jobIds?.includes(jobId)) {
                    return { ...j, liked: !j.liked };
                }
                return j;
            }));
        } catch (error) {
            console.error('북마크 실패:', error);
        }
    };

    const handleJobClick = (job) => {
        if (job.count > 1) {
            // 그룹화된 공고 → 상세 페이지로 이동 (다중 ID 전달)
            navigate(`/recruitments/${job.jobIds[0]}?ids=${job.jobIds.join(',')}`);
        } else {
            // 단일 공고 → 상세 페이지로 이동
            navigate(`/recruitments/${job.id}`);
        }
    };

    const calendarDays = generateCalendarDays(year, month);

    const getJobsForDay = (date, isCurrentMonth) => {
        if (!isCurrentMonth) return [];
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        return filteredJobs.filter(job => job.start === dateString || job.end === dateString);
    };

    const handlePrevMonth = () => {
        const newDate = new Date(year, month - 1, 1);
        setCurrentDate(newDate);
        setSearchParams({ year: newDate.getFullYear(), month: newDate.getMonth() });
    };

    const handleNextMonth = () => {
        const newDate = new Date(year, month + 1, 1);
        setCurrentDate(newDate);
        setSearchParams({ year: newDate.getFullYear(), month: newDate.getMonth() });
    };

    const isToday = (date) => {
        return date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();
    };

    return (
        <div className="px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 fade-in relative pb-[200px]">
            <CustomAlert
                isOpen={!!notification}
                onClose={() => setNotification('')}
                title="공고 선택"
                message={notification}
                type="info"
                confirmText="확인"
            />
            {/* Header */}
            <div className="flex items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Recruitment Calendar</h1>
                <span className="ml-4 bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-1 rounded-lg">
                    2026 Open Season
                </span>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6">
                {/* 기업분류 */}
                <FilterDropdown
                    label="기업분류"
                    options={filterOptions.기업분류}
                    value={activeFilters.companySize}
                    onChange={(val) => setActiveFilters(prev => ({ ...prev, companySize: val }))}
                    isOpen={openFilter === '기업분류'}
                    onToggle={() => setOpenFilter(openFilter === '기업분류' ? null : '기업분류')}
                />
                {/* 직무 */}
                <JobFilterDropdown
                    value={activeFilters.jobType}
                    onChange={(val) => setActiveFilters(prev => ({ ...prev, jobType: val }))}
                    isOpen={openFilter === '직무'}
                    onToggle={() => setOpenFilter(openFilter === '직무' ? null : '직무')}
                />
                {/* 날짜 */}
                <DateFilterDropdown
                    startDate={activeFilters.startDate}
                    endDate={activeFilters.endDate}
                    onStartDateChange={(date) => setActiveFilters(prev => ({ ...prev, startDate: date }))}
                    onEndDateChange={(date) => setActiveFilters(prev => ({ ...prev, endDate: date }))}
                    isOpen={openFilter === '날짜'}
                    onToggle={() => setOpenFilter(openFilter === '날짜' ? null : '날짜')}
                />
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-[30px] shadow-md p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-center gap-6 mb-4">
                    <button onClick={handlePrevMonth} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-3xl font-bold text-gray-600 leading-none pb-1">
                        ‹
                    </button>
                    <h2 className="text-2xl font-bold text-blue-600 min-w-[120px] text-center">
                        {year}.{String(month + 1).padStart(2, '0')}
                    </h2>
                    <button onClick={handleNextMonth} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-3xl font-bold text-gray-600 leading-none pb-1">
                        ›
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7">
                    {dayHeaders.map((day, i) => (
                        <div key={day} className={`text-center text-xs font-bold py-2 border-b-2
              ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-700'}`}>
                            {day}
                        </div>
                    ))}

                    {calendarDays.map(({ date, isCurrentMonth }, i) => {
                        const dayJobs = getJobsForDay(date, isCurrentMonth);
                        const isBottomRow = i >= 28;
                        const isRightColumn = i % 7 >= 5; // 금, 토요일
                        return (
                            <div key={i} className="relative min-h-[140px] border-r border-b p-2">
                                <span className={`font-semibold inline-flex items-center justify-center w-7 h-7 rounded-full
                                    ${!isCurrentMonth ? 'text-gray-300' : ''}
                                    ${isCurrentMonth && isToday(date) ? 'bg-blue-500 text-white' : 'text-gray-800'}`}>
                                    {date.getDate()}
                                </span>
                                <div className="mt-1 space-y-1">
                                    {dayJobs.map(job => (
                                        <div key={job.id} className="group relative">
                                            <div
                                                onClick={() => handleJobClick(job)}
                                                className={`flex items-center justify-between w-full text-xs font-semibold p-1.5 rounded-md cursor-pointer transition-transform hover:scale-[1.02] ${job.color}`}
                                            >
                                                <span className="truncate">{job.name}</span>
                                                <div className="flex items-center gap-1">
                                                    {job.count > 1 && (
                                                        <span className="text-[10px] bg-white/30 px-1.5 rounded-full">
                                                            {job.count}
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={(e) => handleBookmarkToggle(e, job.id)}
                                                        className="p-0.5 hover:scale-110 transition-transform"
                                                    >
                                                        {job.liked ? (
                                                            <Heart className="size-3 fill-red-500 text-red-500" />
                                                        ) : (
                                                            <Heart className="size-3 text-current opacity-50 hover:text-red-400" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Tooltip */}
                                            <div className={`absolute ${isBottomRow ? 'bottom-0' : 'top-0'} ${isRightColumn ? 'right-full mr-2' : 'left-full ml-2'} z-50 hidden group-hover:block transition-opacity`}>
                                                <MiniCalendar job={job} displayYear={year} displayMonth={month} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal Overlay */}
            {selectedJobId && (
                <RecruitmentDetailModal
                    jobId={selectedJobId}
                    onClose={() => setSelectedJobId(null)}
                />
            )}
        </div>
    );
};

export default RecruitmentPage;
