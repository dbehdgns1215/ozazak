import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ChevronDown, ChevronLeft, ChevronRight, X, Clock, MapPin, Building, Sparkles, ExternalLink, Share2 } from 'lucide-react';
import { getRecruitments, getRecruitmentDetail, addBookmark, deleteBookmark } from '../api/recruitment';

// --- Helpers & Visuals from JobCalendarPage ---
const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const filters = ['채용형태', '기업분류', '직무', '날짜기준'];
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
const MiniCalendar = ({ job }) => {
    const endDate = new Date(job.end);
    const startDate = new Date(job.start);
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    const days = generateCalendarDays(year, month);
    const startDayNum = startDate.getDate();
    const endDayNum = endDate.getDate();

    return (
        <div className="p-4 bg-white rounded-xl shadow-2xl border w-[220px]">
            <h3 className="font-bold text-lg">{job.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{job.role}</p>
            <p className="text-center font-bold text-sm my-2">{`${year}.${String(month + 1).padStart(2, '0')}`}</p>
            <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-1">
                {['일', '월', '화', '수', '목', '금', '토'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 text-center text-xs">
                {days.map(({ date, isCurrentMonth }, i) => {
                    const d = date.getDate();
                    const isSelected = isCurrentMonth && d >= startDayNum && d <= endDayNum;
                    return (
                        <span key={i} className={`py-1 rounded-full ${!isCurrentMonth ? 'text-gray-300' : ''} ${isSelected ? 'bg-blue-500 text-white' : ''}`}>
                            {d}
                        </span>
                    );
                })}
            </div>
            <div className="border-t mt-3 pt-3 text-xs text-gray-600">
                <p>시작: {job.start}</p>
                <p>마감: {job.end}</p>
            </div>
        </div>
    );
};

const RecruitmentDetailModal = ({ jobId, onClose }) => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);

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
                                        onClick={() => alert("자소서 생성 페이지로 이동 (구현예정)")}
                                        className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        자소서 생성하기
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

    // Initial State
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Jan 2026
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [selectedJobId, setSelectedJobId] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const res = await getRecruitments();
                const formatted = res.data.map((item, idx) => ({
                    id: item.recruitmentId,
                    name: item.companyName,
                    role: item.title,
                    start: item.startedAt,
                    end: item.endedAt,
                    dDay: item.dday,
                    liked: item.bookmarked,
                    color: colors[idx % colors.length]
                }));

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

                setJobs(Object.values(grouped));
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

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
        const dateString = date.toISOString().split('T')[0];
        return jobs.filter(job => job.start === dateString || job.end === dateString);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 fade-in relative">
            {/* Header */}
            <div className="flex items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Recruitment Calendar</h1>
                <span className="ml-4 bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-1 rounded-lg">
                    2026 Open Season
                </span>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6">
                {filters.map(filter => (
                    <button key={filter} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                        {filter} (All)
                        <ChevronDown className="size-4 text-gray-500" />
                    </button>
                ))}
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-[30px] shadow-md p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronLeft className="size-5" />
                    </button>
                    <h2 className="text-xl font-bold text-blue-600">
                        {year}.{String(month + 1).padStart(2, '0')}
                    </h2>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <ChevronRight className="size-5" />
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-7">
                    {dayHeaders.map((day, i) => (
                        <div key={day} className={`text-center text-xs font-bold py-2 border-b-2
              ${i === 0 ? 'text-red-500' : ''}
              ${i === 6 ? 'text-blue-500' : ''}`}>
                            {day}
                        </div>
                    ))}

                    {calendarDays.map(({ date, isCurrentMonth }, i) => {
                        const dayJobs = getJobsForDay(date, isCurrentMonth);
                        return (
                            <div key={i} className="relative min-h-[140px] border-r border-b p-2">
                                <span className={`font-semibold ${isCurrentMonth ? 'text-gray-800' : 'text-gray-300'}`}>
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
                                                    {job.liked ? (
                                                        <Heart className="size-3 fill-red-500 text-red-500" />
                                                    ) : (
                                                        <Heart className="size-3 text-current opacity-50" />
                                                    )}
                                                </div>
                                            </div>
                                            {/* Tooltip */}
                                            <div className="absolute top-0 left-full ml-2 z-50 hidden group-hover:block transition-opacity">
                                                <MiniCalendar job={job} />
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
